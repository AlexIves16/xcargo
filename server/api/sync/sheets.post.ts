import { defineEventHandler } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
    console.log('[Sync] Точка входа синхронизации активирована, инициализация...');
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;
    if (!SPREADSHEET_ID) {
        console.error('[Sync] SPREADSHEET_ID не определен в конфигурации среды выполнения');
        throw new Error('SPREADSHEET_ID не определен в конфигурации среды выполнения');
    }

    // Проверяем, запущена ли уже синхронизация
    const db = getFirestore();
    const syncLockRef = db.collection('system').doc('sync-lock');
    let lockDoc = await syncLockRef.get();
    
    console.log('[Sync] Проверяем наличие существующих блокировок синхронизации...');
    if (lockDoc.exists && lockDoc.data()?.active) {
        const lockData = lockDoc.data();
        const lockTime = lockData.timestamp?.toDate();
        const now = new Date();
        const diffMinutes = (now.getTime() - lockTime.getTime()) / (1000 * 60);
        
        console.log('[Sync] Найдена существующая блокировка, проверяем возраст:', {
            lockAgeMinutes: diffMinutes,
            threshold: 10,
            initiatedBy: lockData?.initiatedBy,
            userAgent: lockData?.userAgent
        });
        
        // Если блокировка старше 10 минут, считаем её застывшей
        if (diffMinutes < 10) {
            console.log('[Sync] Синхронизация уже запущена, пропускаем дублирующий запрос');
            return { 
                success: false, 
                error: 'Синхронизация уже запущена, дождитесь её завершения', 
                currentlyRunning: true,
                lockAgeMinutes: Math.round(diffMinutes),
                initiatedBy: lockData?.initiatedBy
            };
        } else {
            console.log('[Sync] Очистка устаревшей блокировки синхронизации (возраст: ' + Math.round(diffMinutes) + ' минут)');
            await syncLockRef.update({
                active: false,
                timestamp: Timestamp.now(),
                clearedStale: true,
                previousLockInfo: {
                    initiatedBy: lockData?.initiatedBy,
                    userAgent: lockData?.userAgent,
                    originalTimestamp: lockData?.timestamp
                }
            });
            // Refresh the lock document after update
            lockDoc = await syncLockRef.get();
        }
    }

    // Устанавливаем блокировку
    console.log('[Sync] Устанавливаем блокировку синхронизации...');
    await syncLockRef.set({
        active: true,
        timestamp: Timestamp.now(),
        initiatedBy: event.node.req.headers['x-forwarded-for'] || 'unknown',
        userAgent: event.node.req.headers['user-agent'] || 'unknown'
    });

    // Запускаем синхронизацию в фоне
    console.log('[Sync] Запуск фонового процесса синхронизации...');
    processSyncInBackground(SPREADSHEET_ID, config);

    console.log('[Sync] Синхронизация успешно запущена, возвращаем ответ клиенту');
    return { 
        success: true, 
        message: 'Синхронизация запущена в фоне', 
        estimatedTime: '15-30 минут для больших наборов данных',
        direction: 'односторонняя: Google Таблицы -> База данных Firestore',
        startedAt: new Date().toISOString()
    };
});

async function processSyncInBackground(SPREADSHEET_ID: string, config: any) {
    console.log('[Sync] Инициализация фонового процесса синхронизации');
    try {
        const startTime = Date.now();
        console.log('[Sync] Фоновая синхронизация начата в:', new Date(startTime).toISOString());

        // 1. Initialize Firebase Admin
        let app;
        const apps = getApps();
        let privateKey = config.googlePrivateKey as string;
        const clientEmail = config.googleClientEmail as string;

        // Проверяем наличие необходимых конфигурационных данных
        if (!clientEmail || !privateKey) {
            throw new Error('Missing Google Service Account credentials in runtime config');
        }

        // Handle escaped newlines if they exist
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        if (apps.length === 0) {
            console.log('[Sync] Инициализация нового приложения Firebase...');
            app = initializeApp({
                credential: cert({
                    projectId: config.firebaseProjectId || config.public.firebaseProjectId as string,
                    clientEmail: clientEmail,
                    privateKey: privateKey,
                }),
            });
        } else {
            console.log('[Sync] Использование существующего приложения Firebase...');
            app = getApp();
        }

        const db = getFirestore(app);
        const messaging = getMessaging(app);

        // 2. Initialize Google Sheets Auth
        console.log('[Sync] Инициализация аутентификации Google Таблиц...');
        const authClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        await authClient.authorize();
        console.log('[Sync] Аутентификация Google Таблиц прошла успешно');

        const sheets = google.sheets({ version: 'v4', auth: authClient as any });

        // --- GET SHEET NAME ---
        console.log('[Sync] Получение метаданных электронной таблицы...');
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
            auth: authClient as any
        });

        const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;
        if (!firstSheetTitle) {
            throw new Error('Could not find any sheets in the spreadsheet');
        }

        const rangeName = `${firstSheetTitle}!A:E`;
        console.log('[Sync] Использование листа:', firstSheetTitle);
        console.log('[Sync] Диапазон для чтения:', rangeName);

        // --- LOAD ALL SHEET ROWS ONCE FOR EFFICIENT LOOKUPS ---
        console.log('[Sync] Загрузка всех строк таблицы для эффективного поиска...');
        const sheetRows = await getAllSheetRows(sheets, SPREADSHEET_ID, firstSheetTitle, authClient as any);
        console.log(`[Sync] Загружено ${sheetRows.size} треков из таблицы для поиска`);

        // --- PROCESS FIRESTORE TRACKS INCREMENTALLY ---
        console.log('[Sync] Обработка треков в Firestore инкрементально...');
        
        const BATCH_SIZE = 250; // Increased batch size for better performance
        let lastDoc = null;
        let totalProcessed = 0;
        let stats = { addedToDb: 0, updatedInDb: 0, notificationsSent: 0 };
        
        // Process Firestore in batches with performance tracking
        let batchNumber = 0;
        let lastProgressLog = Date.now();
        const logInterval = 30000; // Log progress every 30 seconds
        
        // Ensure stats is properly initialized
        if (!stats) {
            stats = { addedToDb: 0, updatedInDb: 0, notificationsSent: 0 };
        }
        
        do {
            batchNumber++;
            
            let query = db.collection('tracks').limit(BATCH_SIZE);
            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }
            
            const snapshot = await query.get();
            
            const batch = db.batch();
            const notificationsQueue = [];

            // Process each document individually
            for (const doc of snapshot.docs) {
                const trackData = doc.data();
                const trackNum = trackData.number as string;
                
                if (!trackNum) {
                    continue;
                }
                
                // Look up in pre-loaded sheet data
                const sheetRow = sheetRows.get(trackNum);
                
                if (!sheetRow) {
                    // Track exists in DB but not in sheet - skip (one-way sync: sheet -> DB only)
                    continue;
                } else {
                    // Track exists in both - sync statuses if different
                    let changed = false;
                    let history = trackData.history || [];
                    if (!Array.isArray(history)) history = [];

                    if (sheetRow.chinaStatus && sheetRow.chinaStatus !== trackData.lastChinaStatus) {
                        history.push({
                            status: sheetRow.chinaStatus,
                            location: 'Китай',
                            date: Timestamp.now()
                        });
                        changed = true;
                    }

                    if (sheetRow.secondaryStatus && sheetRow.secondaryStatus !== trackData.lastSecondaryStatus) {
                        history.push({
                            status: sheetRow.secondaryStatus,
                            location: 'International',
                            date: Timestamp.now()
                        });
                        changed = true;
                    }

                    if (changed) {
                        batch.update(doc.ref, {
                            lastChinaStatus: sheetRow.chinaStatus,
                            lastSecondaryStatus: sheetRow.secondaryStatus,
                            status: sheetRow.secondaryStatus || sheetRow.chinaStatus || 'updated',
                            history: history,
                            updatedAt: Timestamp.now()
                        });
                        stats.updatedInDb++;

                        if (trackData.userId) {
                            const newStatus = sheetRow.secondaryStatus || sheetRow.chinaStatus || '';
                            notificationsQueue.push({
                                userId: trackData.userId as string,
                                trackNumber: trackNum,
                                newStatus: newStatus
                            });
                        }
                    }
                }
            }

            // Execute Firestore batch if we have updates
            if (notificationsQueue.length > 0 || (stats && stats.updatedInDb > 0)) {  // Check if batch has operations
                await batch.commit();
            }

            // Process notifications in bulk
            if (notificationsQueue.length > 0) {
                // Process notifications in batches for efficiency
                const MAX_FCM_BATCH_SIZE = 10; // Reduced batch size for reliability
                
                for (let i = 0; i < notificationsQueue.length; i += MAX_FCM_BATCH_SIZE) {
                    const batchNotifications = notificationsQueue.slice(i, i + MAX_FCM_BATCH_SIZE);
                    
                    // Process each notification in the batch
                    for (const notification of batchNotifications) {
                        try {
                            const userSnap = await db.collection('users').doc(notification.userId).get();
                            const userData = userSnap.data();

                            if (userData?.fcmToken) {
                                const message = {
                                    token: userData.fcmToken,
                                    notification: {
                                        title: '📦 Обновление статуса',
                                        body: `Посылка ${notification.trackNumber}: ${notification.newStatus}`
                                    },
                                    data: {
                                        trackNumber: notification.trackNumber,
                                        url: '/dashboard'
                                    }
                                };

                                await messaging.send(message);
                                stats.notificationsSent++;
                            }
                        } catch (fcmError: any) {
                            console.error(`[FCM] Error sending to ${notification.userId}:`, fcmError.message);
                        }
                    }
                    
                    // Small delay between notification batches to prevent overwhelming FCM
                    if (i + MAX_FCM_BATCH_SIZE < notificationsQueue.length) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
            }

            totalProcessed += snapshot.size;
            
            // Log progress periodically instead of every batch
            const now = Date.now();
            if (now - lastProgressLog > logInterval) {
                console.log(`[Sync] Прогресс: Обработано ${totalProcessed} треков, Статистика:`, stats);
                lastProgressLog = now;
            }

            lastDoc = snapshot.docs[snapshot.docs.length - 1];

            // Brief pause between batches to prevent overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 50));
        } while (lastDoc);

        // Process sheet-only entries (add missing tracks from sheet to DB)
        console.log('[Sync] Обработка записей только в таблице (добавление недостающих треков из таблицы в БД)...');
        // Ensure stats is properly initialized before passing to function
        if (!stats) {
            stats = { addedToDb: 0, updatedInDb: 0, notificationsSent: 0 };
        }
        await processSheetOnlyEntries(sheets, SPREADSHEET_ID, firstSheetTitle, db, authClient as any, stats, sheetRows);
        
        // IMPORTANT: We do NOT add records from DB to Sheet (one-way sync: Sheet -> DB only)
        // All changes originate from Google Sheets and are pushed to Firestore DB
        console.log('[Sync] Односторонняя синхронизация завершена: Google Таблицы -> База данных Firestore только');

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        // Снимаем блокировку
        const syncLockRef = db.collection('system').doc('sync-lock');
        await syncLockRef.update({
            active: false,
            completedAt: Timestamp.now(),
            durationSeconds: parseFloat(duration),
            finalStats: stats,
            completedSuccessfully: true
        });

        console.log(`[Sync] Фоновая синхронизация завершена за ${duration}с. Итоговая статистика:`, stats);
        console.log('[Sync] Процесс синхронизации успешно завершен после ' + duration + ' секунд');
        console.log('[Sync] Односторонняя синхронизация завершена: Google Таблицы -> База данных Firestore только');

        // Return stats for admin panel
        return stats;

    } catch (error: any) {
        console.error('[Sync] Фоновая синхронизация не удалась:', error);
        console.error('[Sync] Детали ошибки:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Снимаем блокировку при ошибке
        try {
            const db = getFirestore();
            const syncLockRef = db.collection('system').doc('sync-lock');
            await syncLockRef.update({
                active: false,
                error: error.message,
                errorTime: Timestamp.now(),
                completedSuccessfully: false,
                errorMessage: error.message.substring(0, 500) // Truncate long error messages
            });
        } catch (cleanupError) {
            console.error('[Sync] Ошибка при очистке блокировки синхронизации:', cleanupError);
        }
        
        // Re-throw error so it can be caught by the main handler
        throw error;
    }
}

// Validate track number format (letters, numbers, spaces, hyphens only)
function isValidTrackNumber(trackNum: string): boolean {
    if (!trackNum || trackNum.trim().length === 0) return false;
    // Allow only letters, numbers, spaces, and hyphens
    const validPattern = /^[a-zA-Z0-9\s-]+$/;
    return validPattern.test(trackNum.trim());
}
async function getAllSheetRows(sheets: any, spreadsheetId: string, sheetTitle: string, authClient: any) {
    try {
        const rangeName = `${sheetTitle}!A:E`;
        const sheetResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: rangeName,
            auth: authClient
        });

        const rows = sheetResponse.data.values || [];
        const sheetMap = new Map();
        
        if (rows.length > 1) {
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const trackNum = row[0]?.toString().trim();
                if (trackNum) {
                    sheetMap.set(trackNum, {
                        number: trackNum,
                        chinaStatus: row[1]?.toString().trim() || '',
                        secondaryStatus: row[2]?.toString().trim() || '',
                        date: row[3] || '',
                        rowIndex: i + 1
                    });
                }
            }
        }
        
        return sheetMap;
    } catch (error) {
        console.error('[Sync] Error loading all sheet rows:', error);
        return new Map(); // Return empty map if error
    }
}

// Helper function to process entries that exist only in sheet
async function processSheetOnlyEntries(sheets: any, spreadsheetId: string, sheetTitle: string, db: any, authClient: any, stats: any, sheetRows: Map<any, any>) {
    try {
        // Ensure stats object exists and has required properties
        if (!stats) {
            stats = { addedToDb: 0, updatedInDb: 0, notificationsSent: 0 };
        }
        if (typeof stats.addedToDb === 'undefined') stats.addedToDb = 0;
        if (typeof stats.updatedInDb === 'undefined') stats.updatedInDb = 0;
        if (typeof stats.notificationsSent === 'undefined') stats.notificationsSent = 0;
        console.log(`[Sync] Обработка ${sheetRows.size} записей в таблице для поиска отсутствующих в Firestore`);
        
        // Get current count of tracks in Firestore for comparison
        const firestoreCountSnapshot = await db.collection('tracks').count().get();
        const firestoreCount = firestoreCountSnapshot.data().count;
        console.log(`[Sync] Текущее количество треков в Firestore: ${firestoreCount}`);
        
        // Process each sheet row to see if it exists in Firestore
        let processed = 0;
        let addedToDbCount = 0;
        let alreadyExistsCount = 0;
        let invalidTrackNumbers = [];
        
        for (const [trackNum, sheetRow] of sheetRows.entries()) {
            processed++;
            if (!trackNum) {
                console.log(`[Sync] Пропускаем пустой номер трека в таблице`);
                continue;
            }

            // Validate track number format
            if (!isValidTrackNumber(trackNum)) {
                console.log(`[Sync] ❌ НЕДЕЙСТВИТЕЛЬНЫЙ НОМЕР ТРЕКА в таблице: "${trackNum}" в строке ${sheetRow.rowIndex}`);
                invalidTrackNumbers.push({
                    trackNumber: trackNum,
                    rowIndex: sheetRow.rowIndex,
                    chinaStatus: sheetRow.chinaStatus,
                    secondaryStatus: sheetRow.secondaryStatus
                });
                continue;
            }

            if (processed % 500 === 0) {
                console.log(`[Sync] Прогресс: Обработано ${processed}/${sheetRows.size} записей в таблице...`);
            }
            
            // Check if this track exists in Firestore
            const docSnapshot = await db.collection('tracks').where('number', '==', trackNum).limit(1).get();
            
            if (docSnapshot.empty) {
                // Track exists in sheet but not in DB - add to DB
                const newDocRef = db.collection('tracks').doc();

                // Initial History
                const history = [];
                if (sheetRow.chinaStatus) {
                    history.push({
                        status: sheetRow.chinaStatus,
                        location: 'Китай',
                        date: Timestamp.now()
                    });
                }
                if (sheetRow.secondaryStatus) {
                    history.push({
                        status: sheetRow.secondaryStatus,
                        location: 'International',
                        date: Timestamp.now()
                    });
                }

                await newDocRef.set({
                    number: trackNum,
                    lastChinaStatus: sheetRow.chinaStatus || '',
                    lastSecondaryStatus: sheetRow.secondaryStatus || '',
                    status: (sheetRow.secondaryStatus || sheetRow.chinaStatus || 'pending'),
                    history: history,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    source: 'sheet_sync',
                    sheetRowIndex: sheetRow.rowIndex,
                    sheetData: {
                        chinaStatus: sheetRow.chinaStatus,
                        secondaryStatus: sheetRow.secondaryStatus,
                        date: sheetRow.date
                    }
                });
                
                stats.addedToDb++;
                addedToDbCount++;
            } else {
                alreadyExistsCount++;
            }
            
            // Small pause to prevent overwhelming the system
            if (processed % 200 === 0) {
                await new Promise(resolve => setTimeout(resolve, 25)); // Brief pause every 200 entries
            }
        }
        
        console.log('[Sync] Завершена обработка записей только в таблице. Результат:', {
            totalProcessed: processed,
            addedToDb: addedToDbCount,
            alreadyExists: alreadyExistsCount,
            invalidTrackNumbersCount: invalidTrackNumbers.length,
            invalidTrackNumbers: invalidTrackNumbers.slice(0, 10) // Show first 10 invalid track numbers
        });
    } catch (error) {
        console.error('[Sync] Error processing sheet-only entries:', error);
        throw error; // Re-throw to be caught by main function
    }
}
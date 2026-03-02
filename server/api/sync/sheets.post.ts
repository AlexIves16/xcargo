import { defineEventHandler } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
    console.log('[Sync] Sync endpoint triggered, initializing...');
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;
    if (!SPREADSHEET_ID) {
        console.error('[Sync] SPREADSHEET_ID is not defined in runtime config');
        throw new Error('SPREADSHEET_ID is not defined in runtime config');
    }

    // Проверяем, запущена ли уже синхронизация
    const db = getFirestore();
    const syncLockRef = db.collection('system').doc('sync-lock');
    let lockDoc = await syncLockRef.get();
    
    console.log('[Sync] Checking for existing sync locks...');
    if (lockDoc.exists && lockDoc.data()?.active) {
        const lockData = lockDoc.data();
        const lockTime = lockData.timestamp?.toDate();
        const now = new Date();
        const diffMinutes = (now.getTime() - lockTime.getTime()) / (1000 * 60);
        
        console.log('[Sync] Existing lock found, checking age:', {
            lockAgeMinutes: diffMinutes,
            threshold: 30,
            initiatedBy: lockData.initiatedBy,
            userAgent: lockData.userAgent
        });
        
        // Если блокировка старше 30 минут, считаем её застывшей
        if (diffMinutes < 30) {
            console.log('[Sync] Sync is already running, skipping duplicate request');
            return { 
                success: false, 
                error: 'Sync is already running, please wait for it to complete', 
                currentlyRunning: true,
                lockAgeMinutes: Math.round(diffMinutes),
                initiatedBy: lockData.initiatedBy
            };
        } else {
            console.log('[Sync] Clearing stale sync lock (age: ' + Math.round(diffMinutes) + ' minutes)');
            await syncLockRef.update({
                active: false,
                timestamp: Timestamp.now(),
                clearedStale: true,
                previousLockInfo: {
                    initiatedBy: lockData.initiatedBy,
                    userAgent: lockData.userAgent,
                    originalTimestamp: lockData.timestamp
                }
            });
            // Refresh the lock document after update
            lockDoc = await syncLockRef.get();
        }
    }

    // Устанавливаем блокировку
    console.log('[Sync] Setting sync lock...');
    await syncLockRef.set({
        active: true,
        timestamp: Timestamp.now(),
        initiatedBy: event.node.req.headers['x-forwarded-for'] || 'unknown',
        userAgent: event.node.req.headers['user-agent'] || 'unknown'
    });

    // Для админ-панели выполняем синхронизацию синхронно с таймаутом
    console.log('[Sync] Starting sync process synchronously for admin panel...');
    
    // Устанавливаем таймаут в 60 секунд для админ-панели
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sync timeout: exceeded 60 seconds')), 60000);
    });
    
    // Выполняем синхронизацию и ждем результат
    const syncResultPromise = processSyncInBackground(SPREADSHEET_ID, config);
    
    try {
        // Ждем завершения синхронизации или таймаута
        const stats = await Promise.race([syncResultPromise, timeoutPromise]);
        
        console.log('[Sync] Sync completed successfully, returning stats to client');
        return { 
            success: true, 
            message: 'Sync completed successfully', 
            stats: stats || { addedToDb: 0, updatedInDb: 0, notificationsSent: 0 },
            direction: 'one-way: Google Sheets -> Firestore DB',
            completedAt: new Date().toISOString()
        };
    } catch (error: any) {
        console.error('[Sync] Error during sync:', error);
        
        // Снимаем блокировку в случае ошибки
        const syncLockRef = db.collection('system').doc('sync-lock');
        await syncLockRef.update({
            active: false,
            error: error.message,
            errorTime: Timestamp.now(),
            completedSuccessfully: false,
            errorMessage: error.message.substring(0, 500)
        });
        
        return {
            success: false,
            message: 'Sync failed: ' + error.message,
            error: error.message,
            stats: { addedToDb: 0, updatedInDb: 0, notificationsSent: 0 }
        };
    }
});

async function processSyncInBackground(SPREADSHEET_ID: string, config: any) {
    console.log('[Sync] Background sync process initialized');
    try {
        const startTime = Date.now();
        console.log('[Sync] Background sync started at:', new Date(startTime).toISOString());

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
            console.log('[Sync] Initializing new Firebase app...');
            app = initializeApp({
                credential: cert({
                    projectId: config.firebaseProjectId || config.public.firebaseProjectId as string,
                    clientEmail: clientEmail,
                    privateKey: privateKey,
                }),
            });
        } else {
            console.log('[Sync] Using existing Firebase app...');
            app = getApp();
        }

        const db = getFirestore(app);
        const messaging = getMessaging(app);

        // 2. Initialize Google Sheets Auth
        console.log('[Sync] Initializing Google Sheets authentication...');
        const authClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        await authClient.authorize();
        console.log('[Sync] Google Sheets authentication successful');

        const sheets = google.sheets({ version: 'v4', auth: authClient as any });

        // --- GET SHEET NAME ---
        console.log('[Sync] Getting spreadsheet metadata...');
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
            auth: authClient as any
        });

        const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;
        if (!firstSheetTitle) {
            throw new Error('Could not find any sheets in the spreadsheet');
        }

        const rangeName = `${firstSheetTitle}!A:E`;
        console.log('[Sync] Using sheet:', firstSheetTitle);
        console.log('[Sync] Range to read:', rangeName);

        // --- LOAD ALL SHEET ROWS ONCE FOR EFFICIENT LOOKUPS ---
        console.log('[Sync] Loading all sheet rows for efficient lookups...');
        const sheetRows = await getAllSheetRows(sheets, SPREADSHEET_ID, firstSheetTitle, authClient as any);
        console.log(`[Sync] Loaded ${sheetRows.size} tracks from sheet for lookup`);

        // --- PROCESS FIRESTORE TRACKS INCREMENTALLY ---
        console.log('[Sync] Processing Firestore tracks incrementally...');
        
        const BATCH_SIZE = 25; // Очень маленький размер батча для надежности
        let lastDoc = null;
        let totalProcessed = 0;
        let stats = { addedToDb: 0, updatedInDb: 0, notificationsSent: 0 };
        
        // Process Firestore in very small batches
        let batchNumber = 0;
        do {
            batchNumber++;
            console.log(`[Sync] Processing batch #${batchNumber} starting from document ${totalProcessed + 1}...`);
            
            let query = db.collection('tracks').limit(BATCH_SIZE);
            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }
            
            const snapshot = await query.get();
            console.log(`[Sync] Retrieved batch of ${snapshot.size} documents for batch #${batchNumber}`);
            
            const batch = db.batch();
            const notificationsQueue = [];

            // Process each document individually
            for (const doc of snapshot.docs) {
                const trackData = doc.data();
                const trackNum = trackData.number as string;
                
                if (!trackNum) {
                    console.warn(`[Sync] Skipping invalid track without number: ${doc.id}`);
                    continue;
                }
                
                // Look up in pre-loaded sheet data
                const sheetRow = sheetRows.get(trackNum);
                
                if (!sheetRow) {
                    // Track exists in DB but not in sheet - skip (one-way sync: sheet -> DB only)
                    console.log(`[Sync] Track ${trackNum} exists in DB but not in sheet, skipping (one-way sync)`);
                    continue;
                } else {
                    // Track exists in both - sync statuses if different
                    let changed = false;
                    let history = trackData.history || [];
                    if (!Array.isArray(history)) history = [];

                    if (sheetRow.chinaStatus && sheetRow.chinaStatus !== trackData.lastChinaStatus) {
                        console.log(`[Sync] Track ${trackNum} china status changed: ${trackData.lastChinaStatus} -> ${sheetRow.chinaStatus}`);
                        history.push({
                            status: sheetRow.chinaStatus,
                            location: 'Китай',
                            date: Timestamp.now()
                        });
                        changed = true;
                    }

                    if (sheetRow.secondaryStatus && sheetRow.secondaryStatus !== trackData.lastSecondaryStatus) {
                        console.log(`[Sync] Track ${trackNum} secondary status changed: ${trackData.lastSecondaryStatus} -> ${sheetRow.secondaryStatus}`);
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

                        // Log the update details
                        console.log(`[Sync] 🔄 Updated track ${trackNum} in DB:`, {
                            oldChinaStatus: trackData.lastChinaStatus,
                            newChinaStatus: sheetRow.chinaStatus,
                            oldSecondaryStatus: trackData.lastSecondaryStatus,
                            newSecondaryStatus: sheetRow.secondaryStatus,
                            source: trackData.source || 'unknown'
                        });

                        if (trackData.userId) {
                            const newStatus = sheetRow.secondaryStatus || sheetRow.chinaStatus || '';
                            console.log(`[Sync] Queuing notification for user ${trackData.userId} about track ${trackNum} status: ${newStatus}`);
                            notificationsQueue.push({
                                userId: trackData.userId as string,
                                trackNumber: trackNum,
                                newStatus: newStatus
                            });
                        }
                    } else {
                        console.log(`[Sync] Track ${trackNum} unchanged, no update needed`);
                    }
                }
            }

            // Execute Firestore batch if we have updates
            if (notificationsQueue.length > 0 || snapshot.docs.length > 0) {  // Check if batch has operations
                console.log(`[Sync] Executing Firestore batch with potential operations for batch #${batchNumber}`);
                await batch.commit();
                console.log(`[Sync] Committed Firestore batch #${batchNumber} with ${notificationsQueue.length} potential updates`);
            } else {
                console.log(`[Sync] Batch #${batchNumber} had no updates to commit`);
            }

            // Process notifications
            if (notificationsQueue.length > 0) {
                console.log(`[Sync] Processing ${notificationsQueue.length} notifications from batch #${batchNumber}`);
                for (const notification of notificationsQueue) {
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
                            console.log(`[FCM] ✅ Notification sent to ${notification.userId} for ${notification.trackNumber}`);
                        } else {
                            console.log(`[FCM] ℹ️ No FCM token found for user ${notification.userId}`);
                        }
                    } catch (fcmError: any) {
                        console.error(`[FCM] ❌ Error sending to ${notification.userId}:`, fcmError.message);
                    }
                }
            }

            totalProcessed += snapshot.size;
            lastDoc = snapshot.docs[snapshot.docs.length - 1];
            console.log(`[Sync] Batch #${batchNumber} completed. Processed total: ${totalProcessed}, Stats:`, stats);

            // Освобождаем память и делаем паузу
            if (global.gc) {
                console.log('[Sync] Triggering garbage collection after batch #${batchNumber}...');
                global.gc();
            }
            
            // Пауза между батчами для предотвращения превышения времени
            console.log(`[Sync] Waiting 1 second before next batch...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } while (lastDoc);

        // Process sheet-only entries (add missing tracks from sheet to DB)
        console.log('[Sync] Processing sheet-only entries (adding missing tracks from sheet to DB)...');
        await processSheetOnlyEntries(sheets, SPREADSHEET_ID, firstSheetTitle, db, authClient as any, stats, sheetRows);
        
        // IMPORTANT: We do NOT add records from DB to Sheet (one-way sync: Sheet -> DB only)
        // All changes originate from Google Sheets and are pushed to Firestore DB
        console.log('[Sync] One-way sync completed: Google Sheets -> Firestore DB only');

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

        console.log(`[Sync] Background sync completed in ${duration}s. Final stats:`, stats);
        console.log('[Sync] Sync process finished successfully after ' + duration + ' seconds');
        console.log('[Sync] One-way sync complete: Google Sheets -> Firestore DB only');

        // Return stats for admin panel
        return stats;

    } catch (error: any) {
        console.error('[Sync] Background sync failed:', error);
        console.error('[Sync] Error details:', {
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
            console.error('[Sync] Error cleaning up sync lock:', cleanupError);
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
        console.log(`[Sync] Processing ${sheetRows.size} sheet entries to find ones missing in Firestore`);
        
        // Get current count of tracks in Firestore for comparison
        const firestoreCountSnapshot = await db.collection('tracks').count().get();
        const firestoreCount = firestoreCountSnapshot.data().count;
        console.log(`[Sync] Current Firestore track count: ${firestoreCount}`);
        
        // Process each sheet row to see if it exists in Firestore
        let processed = 0;
        let addedToDbCount = 0;
        let alreadyExistsCount = 0;
        let invalidTrackNumbers = [];
        
        for (const [trackNum, sheetRow] of sheetRows.entries()) {
            processed++;
            if (!trackNum) {
                console.log(`[Sync] Skipping empty track number in sheet`);
                continue;
            }

            // Validate track number format
            if (!isValidTrackNumber(trackNum)) {
                console.log(`[Sync] ❌ INVALID TRACK NUMBER in sheet: "${trackNum}" at row ${sheetRow.rowIndex}`);
                invalidTrackNumbers.push({
                    trackNumber: trackNum,
                    rowIndex: sheetRow.rowIndex,
                    chinaStatus: sheetRow.chinaStatus,
                    secondaryStatus: sheetRow.secondaryStatus
                });
                continue;
            }

            if (processed % 100 === 0) {
                console.log(`[Sync] Progress: Processed ${processed}/${sheetRows.size} sheet entries...`);
            }
            
            console.log(`[Sync] Checking if track ${trackNum} exists in Firestore...`);
            
            // Check if this track exists in Firestore
            const docSnapshot = await db.collection('tracks').where('number', '==', trackNum).limit(1).get();
            
            if (docSnapshot.empty) {
                // Track exists in sheet but not in DB - add to DB
                console.log(`[Sync] Track ${trackNum} exists in sheet but not in DB, adding to Firestore`);
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
                console.log(`[Sync] ✅ Added new track ${trackNum} from sheet to DB (row ${sheetRow.rowIndex})`);
            } else {
                console.log(`[Sync] Track ${trackNum} already exists in Firestore, skipping`);
                alreadyExistsCount++;
            }
            
            // Small pause to prevent overwhelming the system
            if (processed % 50 === 0) {
                console.log(`[Sync] Taking brief pause at entry ${processed}...`);
                await new Promise(resolve => setTimeout(resolve, 50)); // Brief pause every 50 entries
            }
        }
        
        console.log('[Sync] Completed processing sheet-only entries. Summary:', {
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
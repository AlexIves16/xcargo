import { defineEventHandler } from 'h3';
import { Timestamp } from 'firebase-admin/firestore';
import { google } from 'googleapis';
import { getFirebaseAdmin } from '../../utils/firebase';
import { syncLog } from '../../utils/logger';

function parseDateFromStatus(status: string): Date | null {
    if (!status) return null;
    // Гибкий поиск даты: DD.MM.YYYY или DD/MM/YYYY или DD-MM-YYYY
    const dateRegex = /(\d{2})[./-](\d{2})[./-](\d{4})/;
    const match = status.match(dateRegex);
    if (match) {
        const [_, day, month, year] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return null;
}

async function ensureArchiveSheet(sheets: any, spreadsheetId: string, authClient: any): Promise<void> {
    try {
        const meta = await sheets.spreadsheets.get({ spreadsheetId, auth: authClient });
        const archiveExists = meta.data.sheets.some((s: any) => s.properties.title === 'Архив');
        
        if (!archiveExists) {
            await syncLog('Создание листа "Архив"...');
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                auth: authClient,
                requestBody: {
                    requests: [{
                        addSheet: { properties: { title: 'Архив' } }
                    }]
                }
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: 'Архив!A1:E1',
                valueInputOption: 'RAW',
                requestBody: { values: [['Трек номер', 'Статус', 'Дата', 'Инфо', 'Доп']] },
                auth: authClient
            });
        }
    } catch (e: any) {
        await syncLog('Ошибка при создании листа Архива: ' + e.message, true);
    }
}

export default defineEventHandler(async (event) => {
    await syncLog('Синхронизация запрошена');
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;

    if (!SPREADSHEET_ID) {
        await syncLog('SPREADSHEET_ID не определен!', true);
        throw new Error('SPREADSHEET_ID не определен');
    }

    const { db } = getFirebaseAdmin();
    const syncLockRef = db.collection('system').doc('sync-lock');
    let lockDoc = await syncLockRef.get();
    
    if (lockDoc.exists && lockDoc.data()?.active) {
        const lockData = lockDoc.data();
        const lockTime = lockData.timestamp?.toDate();
        const diffMinutes = (new Date().getTime() - lockTime.getTime()) / (1000 * 60);
        
        if (diffMinutes < 15) {
            await syncLog('Синхронизация уже выполняется');
            return { success: false, error: 'Процесс уже запущен' };
        }
    }

    await db.collection('system').doc('sync-status').set({ logs: ['[Инициализация...]'], updatedAt: Timestamp.now() });

    await syncLockRef.set({
        active: true,
        timestamp: Timestamp.now(),
        initiatedBy: event.node.req.headers['x-forwarded-for'] || 'unknown'
    });

    processSyncInBackground(SPREADSHEET_ID, config);

    return { success: true, message: 'Синхронизация запущена' };
});

async function processSyncInBackground(SPREADSHEET_ID: string, config: any) {
    try {
        const startTime = Date.now();
        await syncLog('Старт фонового процесса');
        const { db } = getFirebaseAdmin();

        let privateKey = config.googlePrivateKey as string;
        const clientEmail = config.googleClientEmail as string;

        if (privateKey && privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        const authClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth: authClient as any });
        const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID, auth: authClient as any });
        const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;

        await syncLog('Читаем Google Sheets...');
        const rangeName = `${firstSheetTitle}!A:G`;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: rangeName,
            auth: authClient as any
        });

        const rows = response.data.values || [];
        if (rows.length <= 1) {
            await syncLog('Таблица пуста');
            await db.collection('system').doc('sync-lock').update({ active: false });
            return;
        }

        const header = rows[0];
        const dataRows = rows.slice(1);
        const activeRows = [header];
        const archiveRows = [];
        const threshold = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000));

        await syncLog(`Анализ ${dataRows.length} строк таблицы...`);
        for (const row of dataRows) {
            // Ищем дату во всех колонках статуса и описания для надежности
            const statusContent = (row[1] || '') + (row[2] || '') + (row[3] || ''); 
            const isDelivered = statusContent.toLowerCase().includes('дата получ') || 
                               statusContent.toLowerCase().includes('получено') ||
                               statusContent.toLowerCase().includes('delivered') ||
                               statusContent.toLowerCase().includes('выдан');
            
            if (isDelivered) {
                const deliveryDate = parseDateFromStatus(statusContent);
                if (deliveryDate && deliveryDate < threshold) {
                    archiveRows.push(row);
                    continue;
                }
            }
            activeRows.push(row);
        }

        if (archiveRows.length > 0) {
            await syncLog(`Архивация ${archiveRows.length} старых записей...`);
            await ensureArchiveSheet(sheets, SPREADSHEET_ID, authClient);
            
            // Chunked append for safety
            for (let i = 0; i < archiveRows.length; i += 500) {
                await sheets.spreadsheets.values.append({
                    spreadsheetId: SPREADSHEET_ID,
                    range: 'Архив!A:G',
                    valueInputOption: 'RAW',
                    requestBody: { values: archiveRows.slice(i, i + 500) },
                    auth: authClient as any
                });
            }

            await sheets.spreadsheets.values.clear({ spreadsheetId: SPREADSHEET_ID, range: rangeName, auth: authClient as any });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${firstSheetTitle}!A1`,
                valueInputOption: 'RAW',
                requestBody: { values: activeRows },
                auth: authClient as any
            });
            await syncLog('Лист очищен от архивных записей');
        }

        // Build sheet data map (Normalized keys) with audit
        const sheetRows = new Map();
        let emptyRows = 0;
        let duplicateRows = 0;
        const duplicatesList: string[] = [];

        for (let i = 1; i < activeRows.length; i++) {
            const row = activeRows[i];
            const trackNum = row[0]?.toString().trim().toUpperCase();
            
            if (!trackNum) {
                emptyRows++;
                continue;
            }

            if (sheetRows.has(trackNum)) {
                duplicateRows++;
                if (duplicatesList.length < 5) duplicatesList.push(trackNum);
                continue;
            }

            sheetRows.set(trackNum, { 
                lastChinaStatus: row[1] || '',
                lastSecondaryStatus: row[2] || '',
                // We assume columns D, E, F, G might have other data but we prioritize user data for Admin view
                sheetDescription: row[3] || '',
                sheetUserName: row[5] || '',
                sheetUserEmail: row[6] || ''
            });
        }

        if (emptyRows > 0) await syncLog(`⚠️ Пропущено пустых строк: ${emptyRows}`);
        if (duplicateRows > 0) await syncLog(`⚠️ Найдено дубликатов в таблице: ${duplicateRows} (напр: ${duplicatesList.join(', ')})`);
        
        await syncLog(`Итого уникальных треков в таблице: ${sheetRows.size}`);
        
        // 1. Fetch ALL user claims to enrich the main table
        const userClaimsSnap = await db.collection('user_tracks').get();
        const userClaims = new Map();
        for (const doc of userClaimsSnap.docs) {
            const data = doc.data();
            const num = data.number?.toUpperCase();
            const uid = data.userId;
            if (num) {
                if (!userClaims.has(num)) {
                    userClaims.set(num, {
                        userName: data.userName,
                        userEmail: data.userEmail,
                        description: data.description,
                        userIds: [uid],
                        count: 1
                    });
                } else {
                    const existing = userClaims.get(num);
                    existing.count++;
                    if (!existing.userName.includes(data.userName)) {
                        existing.userName += `, ${data.userName}`;
                    }
                    if (!existing.userIds.includes(uid)) {
                        existing.userIds.push(uid);
                    }
                }
            }
        }
        await syncLog(`Загружено ${userClaims.size} уникальных пользовательских заявок.`);

        // 2. Process main tracks collection
        const allTracksSnapshot = await db.collection('tracks').get();
        const existingTrackNumbers = new Set();
        let batch = db.batch();
        let opsCount = 0;
        let totalProcessed = 0;

        await syncLog(`Сравнение с ${allTracksSnapshot.size} записями в БД...`);

        for (const doc of allTracksSnapshot.docs) {
            const data = doc.data();
            const trackNum = data.number?.toUpperCase();
            if (!trackNum) continue;
            
            existingTrackNumbers.add(trackNum);
            const userClaim = userClaims.get(trackNum);

            if (sheetRows.has(trackNum)) {
                const sheetData = sheetRows.get(trackNum);
                
                // Determine what the Admin should see
                const targetDescription = userClaim?.description || sheetData.sheetDescription || '';
                const targetUserName = userClaim ? (userClaim.count > 1 ? `[${userClaim.count}] ${userClaim.userName}` : userClaim.userName) : (sheetData.sheetUserName || '');
                const targetUserEmail = userClaim?.userEmail || sheetData.sheetUserEmail || '';
                const targetUserIds = userClaim?.userIds || [];

                const hasChanged = sheetData.lastChinaStatus !== data.lastChinaStatus || 
                                 sheetData.lastSecondaryStatus !== data.lastSecondaryStatus ||
                                 targetDescription !== data.description ||
                                 targetUserName !== data.userName ||
                                 targetUserEmail !== data.userEmail ||
                                 JSON.stringify(targetUserIds) !== JSON.stringify(data.userIds || []);
                
                if (hasChanged) {
                    batch.update(doc.ref, {
                        lastChinaStatus: sheetData.lastChinaStatus,
                        lastSecondaryStatus: sheetData.lastSecondaryStatus,
                        description: targetDescription,
                        userName: targetUserName,
                        userEmail: targetUserEmail,
                        userIds: targetUserIds,
                        updatedAt: Timestamp.now()
                    });
                    opsCount++;
                }
            } else {
                // Not in active sheet. 
                // SAFETY: If it's claimed by a user, we KEEP it in 'tracks' so the user can still see their status.
                // UNLESS it's older than 60 days (as per user request)
                if (userClaim) {
                    const addedAt = data.createdAt?.toDate() || new Date();
                    const ageDays = (Date.now() - addedAt.getTime()) / (1000 * 60 * 60 * 24);
                    
                    if (ageDays > 60) {
                        await syncLog(`Удаление старого пользовательского трека: ${trackNum} (${Math.round(ageDays)} дн.)`);
                        batch.delete(doc.ref);
                        opsCount++;
                    }
                } else {
                    // Not in sheet AND no user claims -> Delete (it's likely archived or removed)
                    batch.delete(doc.ref);
                    opsCount++;
                }
            }

            totalProcessed++;
            if (opsCount >= 450) {
                await batch.commit();
                batch = db.batch();
                opsCount = 0;
            }
        }

        // 3. Add new tracks from sheet
        let newCount = 0;
        for (const [trackNum, sheetData] of sheetRows.entries()) {
            if (!existingTrackNumbers.has(trackNum)) {
                const userClaim = userClaims.get(trackNum);
                
                batch.set(db.collection('tracks').doc(), {
                    number: trackNum,
                    lastChinaStatus: sheetData.lastChinaStatus,
                    lastSecondaryStatus: sheetData.lastSecondaryStatus,
                    description: userClaim?.description || sheetData.sheetDescription || '',
                    userName: userClaim ? (userClaim.count > 1 ? `[${userClaim.count}] ${userClaim.userName}` : userClaim.userName) : (sheetData.sheetUserName || ''),
                    userEmail: userClaim?.userEmail || sheetData.sheetUserEmail || '',
                    userIds: userClaim?.userIds || [],
                    status: 'pending',
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });
                opsCount++;
                newCount++;
            }
            if (opsCount >= 450) {
                await batch.commit();
                batch = db.batch();
                opsCount = 0;
            }
        }

        if (opsCount > 0) await batch.commit();

        await syncLog(`Успех! Новых: ${newCount}. Синхронизация завершена.`);
        await db.collection('system').doc('sync-lock').update({ active: false, lastSync: Timestamp.now() });

    } catch (e: any) {
        await syncLog('ОШИБКА: ' + (e.message || 'Неизвестная ошибка'), true);
        const { db } = getFirebaseAdmin();
        await db.collection('system').doc('sync-lock').update({ active: false });
    }
}
import { defineEventHandler } from 'h3';
import { Timestamp } from 'firebase-admin/firestore';
import { google } from 'googleapis';
import { getFirebaseAdmin } from '../../utils/firebase';

function parseDateFromStatus(status: string): Date | null {
    if (!status) return null;
    const dateRegex = /(\d{2})\.(\d{2})\.(\d{4})/;
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
            console.log('[Sync] Создание листа "Архив"...');
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                auth: authClient,
                requestBody: {
                    requests: [{
                        addSheet: { properties: { title: 'Архив' } }
                    }]
                }
            });
            // Add header to new archive sheet
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: 'Архив!A1:E1',
                valueInputOption: 'RAW',
                requestBody: { values: [['Трек номер', 'Статус', 'Дата', 'Инфо', 'Доп']] },
                auth: authClient
            });
        }
    } catch (e) {
        console.error('[Sync] Ошибка при проверке/создании листа Архива:', e);
    }
}

export default defineEventHandler(async (event) => {
    console.log('[Sync] Точка входа синхронизации активирована, инициализация...');
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;
    const ARCHIVE_SHEET_NAME = 'Архив';
    const ARCHIVE_THRESHOLD_DAYS = 14;

    if (!SPREADSHEET_ID) {
        console.error('[Sync] SPREADSHEET_ID не определен в конфигурации среды выполнения');
        throw new Error('SPREADSHEET_ID не определен в конфигурации среды выполнения');
    }

    // Проверяем, запущена ли уже синхронизация
    const { db } = getFirebaseAdmin();
    const syncLockRef = db.collection('system').doc('sync-lock');
    let lockDoc = await syncLockRef.get();
    
    console.log('[Sync] Проверяем наличие существующих блокировок синхронизации...');
    if (lockDoc.exists && lockDoc.data()?.active) {
        const lockData = lockDoc.data();
        const lockTime = lockData.timestamp?.toDate();
        const now = new Date();
        const diffMinutes = (now.getTime() - lockTime.getTime()) / (1000 * 60);
        
        if (diffMinutes < 10) {
            console.log('[Sync] Синхронизация уже запущена, пропускаем дублирующий запрос');
            return { 
                success: false, 
                error: 'Синхронизация уже запущена, дождитесь её завершения', 
                currentlyRunning: true
            };
        }
    }

    // Устанавливаем блокировку
    await syncLockRef.set({
        active: true,
        timestamp: Timestamp.now(),
        initiatedBy: event.node.req.headers['x-forwarded-for'] || 'unknown',
        userAgent: event.node.req.headers['user-agent'] || 'unknown'
    });

    // Запускаем синхронизацию в фоне
    processSyncInBackground(SPREADSHEET_ID, config);

    return { 
        success: true, 
        message: 'Синхронизация запущена в фоне с автоматическим архивированием старых записей', 
        startedAt: new Date().toISOString()
    };
});

async function processSyncInBackground(SPREADSHEET_ID: string, config: any) {
    try {
        const startTime = Date.now();
        const { db, messaging } = getFirebaseAdmin();

        // Google Sheets Auth
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

        await authClient.authorize();
        const sheets = google.sheets({ version: 'v4', auth: authClient as any });

        const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID, auth: authClient as any });
        const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;

        // 3. Get data and archive old rows
        const rangeName = `${firstSheetTitle}!A:E`;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: rangeName,
            auth: authClient as any
        });

        const rows = response.data.values || [];
        if (rows.length <= 1) return;

        const header = rows[0];
        const dataRows = rows.slice(1);
        const activeRows = [header];
        const archiveRows = [];
        const now = new Date();
        const threshold = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));

        for (const row of dataRows) {
            const status = row[1] || '';
            const isDelivered = status.toLowerCase().includes('дата получ') || 
                               status.toLowerCase().includes('получено') ||
                               status.toLowerCase().includes('delivered');
            
            if (isDelivered) {
                const deliveryDate = parseDateFromStatus(status);
                if (deliveryDate && deliveryDate < threshold) {
                    archiveRows.push(row);
                    continue;
                }
            }
            activeRows.push(row);
        }

        if (archiveRows.length > 0) {
            console.log(`[Sync] Архивация ${archiveRows.length} записей...`);
            await ensureArchiveSheet(sheets, SPREADSHEET_ID, authClient);
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Архив!A:E',
                valueInputOption: 'RAW',
                requestBody: { values: archiveRows },
                auth: authClient as any
            });
            await sheets.spreadsheets.values.clear({ spreadsheetId: SPREADSHEET_ID, range: rangeName, auth: authClient as any });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${firstSheetTitle}!A1`,
                valueInputOption: 'RAW',
                requestBody: { values: activeRows },
                auth: authClient as any
            });
        }

        const sheetRows = new Map();
        for (let i = 1; i < activeRows.length; i++) {
            const row = activeRows[i];
            const trackNum = row[0]?.toString().trim();
            if (trackNum) {
                sheetRows.set(trackNum, {
                    status: row[1] || '',
                    date: row[2] || '',
                    info: row[3] || '',
                    additional: row[4] || ''
                });
            }
        }

        const allTracksSnapshot = await db.collection('tracks').get();
        const existingTrackNumbers = new Set();
        
        const BATCH_SIZE = 500;
        let batch = db.batch();
        let opsCount = 0;

        for (const doc of allTracksSnapshot.docs) {
            const data = doc.data();
            const trackNum = data.number;
            existingTrackNumbers.add(trackNum);

            if (sheetRows.has(trackNum)) {
                const sheetData = sheetRows.get(trackNum);
                if (sheetData.status !== data.status || sheetData.info !== data.info || sheetData.additional !== data.additional) {
                    batch.update(doc.ref, {
                        status: sheetData.status,
                        info: sheetData.info,
                        additional: sheetData.additional,
                        updatedAt: Timestamp.now()
                    });
                    opsCount++;
                }
            } else {
                batch.delete(doc.ref);
                opsCount++;
            }

            if (opsCount >= BATCH_SIZE) {
                await batch.commit();
                batch = db.batch();
                opsCount = 0;
            }
        }

        for (const [trackNum, sheetData] of sheetRows.entries()) {
            if (!existingTrackNumbers.has(trackNum)) {
                const newDocRef = db.collection('tracks').doc();
                batch.set(newDocRef, {
                    number: trackNum,
                    status: sheetData.status,
                    info: sheetData.info,
                    additional: sheetData.additional,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });
                opsCount++;
            }

            if (opsCount >= BATCH_SIZE) {
                await batch.commit();
                batch = db.batch();
                opsCount = 0;
            }
        }

        if (opsCount > 0) await batch.commit();

        const syncLockRef = db.collection('system').doc('sync-lock');
        await syncLockRef.update({ active: false, lastSync: Timestamp.now() });

        console.log('[Sync] Синхронизация завершена успешно за', (Date.now() - startTime) / 1000, 'сек');

    } catch (e: any) {
        console.error('[Sync] Ошибка:', e);
        const { db } = getFirebaseAdmin();
        await db.collection('system').doc('sync-lock').update({ active: false, error: e.message });
    }
}
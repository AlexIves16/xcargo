import { defineEventHandler } from 'h3';
import { Timestamp } from 'firebase-admin/firestore';
import { google } from 'googleapis';
import { getFirebaseAdmin } from '../../utils/firebase';
import { syncLog } from '../../utils/logger';

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
    await syncLog('Точка входа синхронизации активирована');
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
            await syncLog('Синхронизация уже запущена другим процессом');
            return { success: false, error: 'Синхронизация уже запущена' };
        }
    }

    // Reset logs at the start of new sync
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
        await syncLog('Фоновый процесс начат');
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

        await syncLog('Загрузка данных из Google Sheets...');
        const rangeName = `${firstSheetTitle}!A:E`;
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

        await syncLog(`Обработка ${dataRows.length} строк...`);
        for (const row of dataRows) {
            const status = row[1] || '';
            const isDelivered = status.toLowerCase().includes('дата получ') || status.toLowerCase().includes('получено');
            
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
            await syncLog(`Архивация ${archiveRows.length} записей...`);
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
            await syncLog('Таблица очищена от старых записей');
        }

        const sheetRows = new Map();
        for (let i = 1; i < activeRows.length; i++) {
            const row = activeRows[i];
            const trackNum = row[0]?.toString().trim();
            if (trackNum) {
                sheetRows.set(trackNum, { status: row[1] || '', info: row[3] || '', additional: row[4] || '' });
            }
        }

        await syncLog('Обновление базы данных Firestore...');
        const allTracksSnapshot = await db.collection('tracks').get();
        const existingTrackNumbers = new Set();
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

            if (opsCount >= 400) {
                await batch.commit();
                batch = db.batch();
                opsCount = 0;
            }
        }

        for (const [trackNum, sheetData] of sheetRows.entries()) {
            if (!existingTrackNumbers.has(trackNum)) {
                batch.set(db.collection('tracks').doc(), {
                    number: trackNum,
                    status: sheetData.status,
                    info: sheetData.info,
                    additional: sheetData.additional,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });
                opsCount++;
            }
            if (opsCount >= 400) {
                await batch.commit();
                batch = db.batch();
                opsCount = 0;
            }
        }

        if (opsCount > 0) await batch.commit();

        await syncLog('Синхронизация завершена успешно!');
        await db.collection('system').doc('sync-lock').update({ active: false, lastSync: Timestamp.now() });

    } catch (e: any) {
        await syncLog('КРИТИЧЕСКАЯ ОШИБКА: ' + e.message, true);
        const { db } = getFirebaseAdmin();
        await db.collection('system').doc('sync-lock').update({ active: false });
    }
}
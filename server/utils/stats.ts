import { getFirebaseAdmin } from './firebase';
import { getGoogleSheetsClient } from './google';

export const getSystemStats = async () => {
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;

    let dbCount = 0;
    let sheetCount = 0;

    try {
        // 1. DB Count
        const { db } = getFirebaseAdmin();
        const snapshot = await db.collection('tracks').count().get();
        dbCount = snapshot.data().count;
    } catch (e) {
        console.error('[Stats] DB Count Failed:', e);
    }

    try {
        // 2. Sheet Count
        if (SPREADSHEET_ID) {
            const sheets = await getGoogleSheetsClient();
            const meta = await sheets.spreadsheets.get({
                spreadsheetId: SPREADSHEET_ID
            });
            const title = meta.data.sheets?.[0]?.properties?.title;

            if (title) {
                const res = await sheets.spreadsheets.values.get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${title}!A:A`
                });
                const rows = res.data.values || [];
                sheetCount = Math.max(0, rows.length - 1);
            }
        }
    } catch (e) {
        console.error('[Stats] Sheet Count Failed:', e);
    }

    return { db: dbCount, sheet: sheetCount };
};

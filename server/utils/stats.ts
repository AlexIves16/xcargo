import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from './firebase'; // Assuming this exists or I use logic from sheets.post.ts
// Actually, let's look at how firebase is init in other files. 
// sheets.post.ts inits it inline. track.post.ts uses `getFirebaseAdmin`.
// I should rely on `getFirebaseAdmin` if it exists, otherwise replicate safe init.

export const getSystemStats = async () => {
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;

    // 1. DB Count
    // Use existing util if possible, or robust init
    // Let's use the robust pattern from track.post.ts / firebase.ts
    // Wait, I need to check `server/utils/firebase.ts` content first to be sure.
    // Assuming standard usage for now based on previous context.

    // Check if getFirebaseAdmin exists by trying to import - actually I can just use it if it's auto-imported or in utils
    // Nuxt auto-imports from server/utils.

    // Just in case, let's implement a safe DB getter here or use the one from utils if standard.
    // I recall `getFirebaseAdmin` being used in `track.post.ts`.

    const { db } = getFirebaseAdmin();

    let dbCount = 0;
    try {
        const snapshot = await db.collection('tracks').count().get();
        dbCount = snapshot.data().count;
    } catch (e) {
        console.error('Stats: DB Count Failed', e);
    }

    // 2. Sheet Count
    let sheetCount = 0;
    if (SPREADSHEET_ID) {
        try {
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
        } catch (e) {
            console.error('Stats: Sheet Count Failed', e);
        }
    }

    return { db: dbCount, sheet: sheetCount };
};

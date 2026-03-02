import { defineEventHandler } from 'h3';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig();
        const SPREADSHEET_ID = config.spreadsheetId;
        const clientEmail = config.googleClientEmail;
        let privateKey = config.googlePrivateKey as string;

        if (!SPREADSHEET_ID || !clientEmail || !privateKey) {
            return {
                success: false,
                error: 'Missing Google Sheets configuration',
                missing: {
                    spreadsheetId: !SPREADSHEET_ID,
                    clientEmail: !clientEmail,
                    privateKey: !privateKey
                }
            };
        }

        // Handle escaped newlines
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        // Initialize Google Sheets Auth
        const authClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        await authClient.authorize();
        console.log('[Test] Google Sheets auth successful');

        const sheets = google.sheets({ version: 'v4', auth: authClient as any });

        // Test access to spreadsheet
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
            auth: authClient as any
        });

        const sheetTitle = meta.data.sheets?.[0]?.properties?.title || 'Unknown';
        console.log(`[Test] Spreadsheet title: ${sheetTitle}`);

        // Test reading data
        const rangeName = `${sheetTitle}!A1:E5`;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: rangeName,
            auth: authClient as any
        });

        const rows = response.data.values || [];
        console.log(`[Test] Found ${rows.length} rows in test range`);

        return {
            success: true,
            spreadsheetId: SPREADSHEET_ID,
            sheetTitle: sheetTitle,
            rowCount: rows.length,
            firstRow: rows[0] || null,
            config: {
                clientEmail: clientEmail,
                hasPrivateKey: !!privateKey
            }
        };

    } catch (error: any) {
        console.error('[Test] Google Sheets connection failed:', error);
        return {
            success: false,
            error: error.message,
            code: error.code,
            details: error.errors || []
        };
    }
});
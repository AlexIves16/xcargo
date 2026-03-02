import { defineEventHandler } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { google } from 'googleapis';

// Validate track number format (letters, numbers, spaces, hyphens only)
function isValidTrackNumber(trackNum: string): boolean {
    if (!trackNum || trackNum.trim().length === 0) return false;
    // Allow only letters, numbers, spaces, and hyphens
    const validPattern = /^[a-zA-Z0-9\s-]+$/;
    return validPattern.test(trackNum.trim());
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;
    
    if (!SPREADSHEET_ID) {
        throw new Error('SPREADSHEET_ID is not defined in runtime config');
    }

    try {
        console.log('[CleanSheet] Starting cleanup of broken records from Google Sheet...');
        
        // Initialize Firebase Admin (for Google Sheets auth)
        let app;
        const apps = getApps();
        let privateKey = config.googlePrivateKey as string;
        const clientEmail = config.googleClientEmail as string;

        // Handle escaped newlines if they exist
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        if (apps.length === 0) {
            app = initializeApp({
                credential: cert({
                    projectId: config.firebaseProjectId || config.public.firebaseProjectId as string,
                    clientEmail: clientEmail,
                    privateKey: privateKey,
                }),
            });
        } else {
            app = getApp();
        }

        // Initialize Google Sheets Auth
        const authClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        await authClient.authorize();
        const sheets = google.sheets({ version: 'v4', auth: authClient as any });

        // Get sheet metadata
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
            auth: authClient as any
        });

        const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;
        if (!firstSheetTitle) {
            throw new Error('Could not find any sheets in the spreadsheet');
        }

        const rangeName = `${firstSheetTitle}!A:E`;
        console.log('[CleanSheet] Using sheet:', firstSheetTitle);

        // Read all data from sheet
        console.log('[CleanSheet] Reading all sheet data...');
        const sheetResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: rangeName,
            auth: authClient as any
        });

        const rows = sheetResponse.data.values || [];
        console.log(`[CleanSheet] Found ${rows.length} rows in sheet`);
        
        if (rows.length <= 1) {
            return {
                success: true,
                message: 'Sheet is empty or contains only headers',
                processedRows: rows.length,
                deletedRows: 0
            };
        }

        // Identify rows to delete (skip header row)
        const rowsToDelete = [];
        const validRows = [];
        
        // First row is header, so start from index 1
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const trackNum = row[0]?.toString().trim();
            
            // Check if track number is invalid
            if (!trackNum || !isValidTrackNumber(trackNum)) {
                console.log(`[CleanSheet] Found broken record at row ${i + 1}: "${trackNum}"`);
                rowsToDelete.push({
                    rowIndex: i + 1, // 1-based indexing for Google Sheets
                    trackNumber: trackNum,
                    rowData: row
                });
            } else {
                validRows.push(row);
            }
        }

        console.log(`[CleanSheet] Found ${rowsToDelete.length} broken records to delete`);

        if (rowsToDelete.length === 0) {
            return {
                success: true,
                message: 'No broken records found in sheet',
                processedRows: rows.length,
                deletedRows: 0,
                sampleValidRecords: validRows.slice(0, 5)
            };
        }

        // Delete rows from sheet (in reverse order to maintain correct indices)
        console.log('[CleanSheet] Deleting broken records from sheet...');
        const deleteRequests = [];
        
        // Sort by row index descending to avoid index shifting issues
        rowsToDelete.sort((a, b) => b.rowIndex - a.rowIndex);
        
        for (const brokenRecord of rowsToDelete) {
            deleteRequests.push({
                deleteDimension: {
                    range: {
                        sheetId: meta.data.sheets?.[0]?.properties?.sheetId,
                        dimension: 'ROWS',
                        startIndex: brokenRecord.rowIndex - 1, // Convert to 0-based
                        endIndex: brokenRecord.rowIndex
                    }
                }
            });
        }

        // Execute batch update to delete rows
        if (deleteRequests.length > 0) {
            console.log(`[CleanSheet] Executing batch delete of ${deleteRequests.length} rows...`);
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                auth: authClient as any,
                requestBody: {
                    requests: deleteRequests
                }
            });
        }

        console.log(`[CleanSheet] Successfully deleted ${rowsToDelete.length} broken records from sheet`);
        
        return {
            success: true,
            message: `Successfully cleaned up ${rowsToDelete.length} broken records from Google Sheet`,
            processedRows: rows.length,
            deletedRows: rowsToDelete.length,
            deletedRecords: rowsToDelete.map(r => ({
                rowIndex: r.rowIndex,
                trackNumber: r.trackNumber
            })),
            sampleValidRecords: validRows.slice(0, 5)
        };

    } catch (error: any) {
        console.error('[CleanSheet] Error:', error);
        return {
            success: false,
            error: error.message,
            details: error.stack
        };
    }
});
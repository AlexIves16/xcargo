import { defineEventHandler } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const SPREADSHEET_ID = config.spreadsheetId;
    if (!SPREADSHEET_ID) {
        throw new Error('SPREADSHEET_ID is not defined in runtime config');
    }

    // 1. Initialize Firebase Admin
    let app;
    const apps = getApps();
    let privateKey = config.googlePrivateKey as string;
    const clientEmail = config.googleClientEmail as string;

    console.log('[Sync] Starting... Checking config.');

    if (!SPREADSHEET_ID) return { success: false, error: 'Config Missing: SPREADSHEET_ID' };
    if (!privateKey) return { success: false, error: 'Config Missing: GOOGLE_PRIVATE_KEY' };
    if (!clientEmail) return { success: false, error: 'Config Missing: GOOGLE_CLIENT_EMAIL' };

    console.log('[Sync] Config keys present. ID:', SPREADSHEET_ID, 'Email:', clientEmail);

    // Handle escaped newlines if they exist
    if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (apps.length === 0) {
        try {
            console.log('[Sync] Initializing Firebase Admin...');
            app = initializeApp({
                credential: cert({
                    projectId: config.firebaseProjectId || config.public.firebaseProjectId as string,
                    clientEmail: clientEmail,
                    privateKey: privateKey,
                }),
            });
            console.log('[Sync] Firebase Admin initialized.');
        } catch (e: any) {
            console.error('[Sync] Firebase Init Error:', e);
            throw new Error(`Firebase Init Failed: ${e.message}`);
        }
    } else {
        app = getApp();
        console.log('[Sync] Reusing existing Firebase Admin app.');
    }

    const db = getFirestore(app);

    // 2. Initialize Google Sheets Auth
    console.log('[Sync] Initializing Google JWT Client...');
    const jwtClient = new google.auth.JWT(
        clientEmail,
        undefined,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth: jwtClient });

    try {
        // --- GET SHEET NAME ---
        console.log('[Sync] Authenticated. Fetching spreadsheet metadata...');
        // Fetch spreadsheet metadata to get the name of the first sheet dynamically
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        });

        const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;
        if (!firstSheetTitle) {
            throw new Error('Could not find any sheets in the spreadsheet');
        }

        const rangeName = `${firstSheetTitle}!A:E`;

        // --- READ DATA ---
        console.log('[Sync] Fetching tracks from Firestore...');
        // Fetch all tracks from Firestore
        const snapshot = await db.collection('tracks').get();
        const dbTracks = new Map();
        snapshot.forEach(doc => {
            dbTracks.set(doc.data().number, { id: doc.id, ...doc.data() });
        });
        console.log(`[Sync] Found ${dbTracks.size} tracks in Firestore`);

        // Fetch all rows from Sheet
        console.log(`[Sync] Fetching rows from Sheet: ${rangeName}`);
        const sheetResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: rangeName,
        });

        const rows = sheetResponse.data.values || [];
        console.log(`[Sync] Found ${rows.length} rows in Sheet`);
        const sheetTracks = new Map();

        // Parse Sheet Rows (Skipping Header)
        // Expected: [Track, Description, Status, Date, User]
        if (rows.length > 1) {
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const trackNum = row[0]?.toString().trim();
                if (trackNum) {
                    sheetTracks.set(trackNum, {
                        number: trackNum,
                        description: row[1] || '',
                        status: row[2] || 'pending',
                        date: row[3] || '',
                        rowIndex: i + 1 // 1-based index for updates
                    });
                }
            }
        } else {
            // If empty, initialize header
            console.log('[Sync] Sheet is empty, initializing header...');
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${firstSheetTitle}!A1:E1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [['Трек-номер', 'Описание', 'Статус', 'Дата добавления', 'ID Пользователя']]
                }
            });
        }

        console.log(`[Sync] Parsed ${sheetTracks.size} valid tracks from Sheet`);

        // --- SYNCHRONIZE ---

        const dbOperations = []; // Array of { type: 'set' | 'update', ref: DocumentReference, data: any }
        const sheetAppends = [];
        let stats = { addedToDb: 0, addedToSheet: 0, updatedInDb: 0, updatedInSheet: 0 };

        const allTrackNumbers = new Set([...dbTracks.keys(), ...sheetTracks.keys()]);
        console.log(`[Sync] Total unique tracks to process: ${allTrackNumbers.size}`);

        for (const num of allTrackNumbers) {
            const dbTrack = dbTracks.get(num);
            const sheetTrack = sheetTracks.get(num);

            if (dbTrack && !sheetTrack) {
                // Exists in DB, missing in Sheet -> Add to Sheet
                sheetAppends.push([
                    dbTrack.number,
                    dbTrack.description || '',
                    dbTrack.status || 'pending',
                    dbTrack.createdAt ? new Date(dbTrack.createdAt.seconds * 1000).toISOString().split('T')[0] : '',
                    dbTrack.userId || ''
                ]);
                stats.addedToSheet++;
            }
            else if (!dbTrack && sheetTrack) {
                // Exists in Sheet, missing in DB -> Add to DB
                const newDocRef = db.collection('tracks').doc();
                dbOperations.push({
                    type: 'set',
                    ref: newDocRef,
                    data: {
                        number: sheetTrack.number,
                        description: sheetTrack.description,
                        status: sheetTrack.status,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                        source: 'sheet_sync'
                    }
                });
                stats.addedToDb++;
            }
            else if (dbTrack && sheetTrack) {
                // Exists in Both -> Sync Status from Sheet to DB if valid
                const validStatuses = ['pending', 'in_transit', 'arrived', 'delivered', 'lost'];
                if (validStatuses.includes(sheetTrack.status) && sheetTrack.status !== dbTrack.status) {
                    dbOperations.push({
                        type: 'update',
                        ref: db.collection('tracks').doc(dbTrack.id),
                        data: {
                            status: sheetTrack.status,
                            updatedAt: Timestamp.now()
                        }
                    });
                    stats.updatedInDb++;
                }
            }
        }

        console.log('[Sync] Sync logic complete. Stats:', stats);

        // --- EXECUTE BATCHES ---

        // 1. Write to Firestore (Chunked)
        const BATCH_SIZE = 400; // Limit is 500, keeping safe margin
        if (dbOperations.length > 0) {
            console.log(`[Sync] Committing ${dbOperations.length} operations in chunks of ${BATCH_SIZE}...`);

            for (let i = 0; i < dbOperations.length; i += BATCH_SIZE) {
                const chunk = dbOperations.slice(i, i + BATCH_SIZE);
                const batch = db.batch();

                chunk.forEach(op => {
                    if (op.type === 'set') {
                        batch.set(op.ref, op.data);
                    } else if (op.type === 'update') {
                        batch.update(op.ref, op.data);
                    }
                });

                await batch.commit();
                console.log(`[Sync] Committed chunk ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(dbOperations.length / BATCH_SIZE)}`);
            }
        }

        // 2. Write to Sheets (Append new rows)
        if (sheetAppends.length > 0) {
            console.log(`[Sync] Appending ${sheetAppends.length} rows to Sheet...`);
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: rangeName,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: sheetAppends
                }
            });
        }

        console.log('[Sync] Operation successful');
        return { success: true, stats };

    } catch (error: any) {
        console.error('Sync Error:', error);
        return { success: false, error: error.message };
    }
});

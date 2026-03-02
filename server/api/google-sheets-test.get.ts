import { defineEventHandler } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    
    try {
        // Проверяем наличие всех необходимых параметров
        if (!config.googleClientEmail || !config.googlePrivateKey || !config.spreadsheetId) {
            return {
                success: false,
                error: 'Missing required Google Sheets configuration',
                missingFields: [
                    !config.googleClientEmail ? 'googleClientEmail' : null,
                    !config.googlePrivateKey ? 'googlePrivateKey' : null,
                    !config.spreadsheetId ? 'spreadsheetId' : null
                ].filter(Boolean)
            };
        }

        // Инициализируем Firebase Admin если еще не инициализирован
        let app;
        const apps = getApps();
        let privateKey = config.googlePrivateKey as string;
        const clientEmail = config.googleClientEmail as string;

        // Обработка экранированных новой строки
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

        // Инициализируем Google Sheets API
        const authClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] // Только чтение для проверки
        });

        await authClient.authorize();
        const sheets = google.sheets({ version: 'v4', auth: authClient as any });

        // Пробуем получить метаданные таблицы
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: config.spreadsheetId,
            auth: authClient as any
        });

        return {
            success: true,
            message: 'Google Sheets connection established successfully!',
            spreadsheetTitle: meta.data.properties?.title,
            sheetsCount: meta.data.sheets?.length || 0,
            firstSheetName: meta.data.sheets?.[0]?.properties?.title || 'Unknown'
        };

    } catch (error: any) {
        console.error('Google Sheets connection test failed:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to connect to Google Sheets'
        };
    }
});
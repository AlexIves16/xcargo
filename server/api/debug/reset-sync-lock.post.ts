import { defineEventHandler } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
    try {
        // Инициализируем Firebase, если еще не инициализирован
        let app;
        const apps = getApps();
        const config = useRuntimeConfig();
        
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

        const db = getFirestore(app);
        const syncLockRef = db.collection('system').doc('sync-lock');
        
        await syncLockRef.update({
            active: false,
            completedAt: Timestamp.now(),
            durationSeconds: 0,
            finalStats: { reset: true },
            resetBy: 'manual-reset-endpoint'
        });
        
        return {
            success: true,
            message: 'Sync lock has been manually reset'
        };
    } catch (error: any) {
        console.error('[Reset Sync Lock] Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
});
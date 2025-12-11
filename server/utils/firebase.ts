import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

export const getFirebaseAdmin = () => {
    const config = useRuntimeConfig();
    let app;
    const apps = getApps();

    if (apps.length === 0) {
        let privateKey = config.googlePrivateKey as string;
        if (!privateKey) {
            throw new Error('GOOGLE_PRIVATE_KEY is not defined in runtime config');
        }
        // Handle escaped newlines
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        app = initializeApp({
            credential: cert({
                projectId: config.firebaseProjectId || config.public.firebaseProjectId as string,
                clientEmail: config.googleClientEmail as string,
                privateKey: privateKey,
            }),
        });
    } else {
        app = getApp();
    }

    return {
        db: getFirestore(app),
        messaging: getMessaging(app)
    };
};

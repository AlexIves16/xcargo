import { Timestamp } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from './firebase';

export const syncLog = async (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;
    
    // 1. Log to server console
    if (isError) {
        console.error(fullMessage);
    } else {
        console.log(fullMessage);
    }

    try {
        // 2. Log to Firestore for browser visibility
        const { db } = getFirebaseAdmin();
        const logRef = db.collection('system').doc('sync-status');
        
        await logRef.set({
            lastMessage: message,
            isError,
            updatedAt: Timestamp.now(),
            // Keep a small history of last 15 logs
            logs: (await logRef.get()).data()?.logs?.slice(-14).concat(fullMessage) || [fullMessage]
        }, { merge: true });
    } catch (e) {
        console.error('Failed to write sync log to Firestore:', e);
    }
};

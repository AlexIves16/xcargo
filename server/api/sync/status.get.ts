import { defineEventHandler } from 'h3';
import { getFirestore } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
    try {
        const db = getFirestore();
        const syncLockRef = db.collection('system').doc('sync-lock');
        const lockDoc = await syncLockRef.get();
        
        if (!lockDoc.exists) {
            return {
                success: true,
                status: 'not_running',
                message: 'No sync is currently running'
            };
        }
        
        const data = lockDoc.data();
        
        return {
            success: true,
            status: data?.active ? 'running' : 'completed',
            active: data?.active || false,
            timestamp: data?.timestamp?.toDate()?.toISOString() || null,
            initiatedBy: data?.initiatedBy || null,
            completedAt: data?.completedAt?.toDate()?.toISOString() || null,
            durationSeconds: data?.durationSeconds || null,
            finalStats: data?.finalStats || null,
            error: data?.error || null,
            errorTime: data?.errorTime?.toDate()?.toISOString() || null
        };
        
    } catch (error: any) {
        console.error('[Sync Status] Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
});
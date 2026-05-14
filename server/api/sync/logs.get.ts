import { defineEventHandler } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    try {
        const { db } = getFirebaseAdmin();
        const doc = await db.collection('system').doc('sync-status').get();
        const lock = await db.collection('system').doc('sync-lock').get();
        
        return {
            success: true,
            logs: doc.data()?.logs || [],
            active: lock.data()?.active || false,
            updatedAt: doc.data()?.updatedAt?.toDate()
        };
    } catch (e: any) {
        return {
            success: false,
            error: e.message
        };
    }
});

import { defineEventHandler } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    try {
        const { db } = getFirebaseAdmin();
        await db.collection('system').doc('sync-lock').update({
            active: false,
            timestamp: new Date(),
            manualReset: true
        });
        
        // Also clear logs
        await db.collection('system').doc('sync-status').update({
            logs: ['[Блокировка сброшена вручную]']
        });

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});
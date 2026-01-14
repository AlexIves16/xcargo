import { defineEventHandler } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    const { db } = getFirebaseAdmin();

    try {
        console.log('[Admin] Starting cleanup of old delivered parcels...');

        // Calculate date 7 days ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Status values to clean up (delivered parcels)
        const statusesToDelete = ['delivered', 'ready_for_pickup'];
        
        let totalDeleted = 0;

        for (const status of statusesToDelete) {
            // Query for old delivered parcels
            const query = db.collection('tracks')
                .where('status', '==', status)
                .where('updatedAt', '<', oneWeekAgo);
            
            const snapshot = await query.get();
            
            if (!snapshot.empty) {
                const batch = db.batch();
                let batchCount = 0;
                
                for (const doc of snapshot.docs) {
                    batch.delete(doc.ref);
                    batchCount++;
                    
                    // Firestore batches have a limit of 500 operations
                    if (batchCount >= 500) {
                        await batch.commit();
                        totalDeleted += batchCount;
                        batchCount = 0;
                    }
                }
                
                // Commit remaining docs in batch
                if (batchCount > 0) {
                    await batch.commit();
                    totalDeleted += batchCount;
                }
            }
        }

        // Also check by createdAt if updatedAt is missing
        for (const status of statusesToDelete) {
            const queryByCreated = db.collection('tracks')
                .where('status', '==', status)
                .where('createdAt', '<', oneWeekAgo);
            
            const snapshotCreated = await queryByCreated.get();
            
            if (!snapshotCreated.empty) {
                const batch = db.batch();
                let batchCount = 0;
                
                for (const doc of snapshotCreated.docs) {
                    // Skip if already deleted (had updatedAt)
                    const data = doc.data();
                    if (data.updatedAt && data.updatedAt.toDate() >= oneWeekAgo) {
                        continue;
                    }
                    
                    batch.delete(doc.ref);
                    batchCount++;
                    
                    if (batchCount >= 500) {
                        await batch.commit();
                        totalDeleted += batchCount;
                        batchCount = 0;
                    }
                }
                
                if (batchCount > 0) {
                    await batch.commit();
                    totalDeleted += batchCount;
                }
            }
        }

        console.log(`[Admin] Deleted ${totalDeleted} old delivered parcels.`);

        return { 
            success: true, 
            deleted: totalDeleted,
            message: `Удалено ${totalDeleted} посылок со статусом "Доставлено" старше недели.`
        };

    } catch (e: any) {
        console.error('[Admin] Clear Old Delivered Error:', e);
        return { success: false, error: e.message };
    }
});

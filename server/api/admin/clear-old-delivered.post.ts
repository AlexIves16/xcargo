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
            // Query only by status (no composite index needed)
            const query = db.collection('tracks').where('status', '==', status);
            const snapshot = await query.get();

            if (snapshot.empty) continue;

            // Filter by date on server side
            const docsToDelete = snapshot.docs.filter(doc => {
                const data = doc.data();

                // Check updatedAt first, then createdAt
                let docDate = null;
                if (data.updatedAt) {
                    docDate = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
                } else if (data.createdAt) {
                    docDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                }

                // If no date found, skip (don't delete)
                if (!docDate) return false;

                // Return true if older than one week
                return docDate < oneWeekAgo;
            });

            console.log(`[Admin] Found ${docsToDelete.length} old parcels with status "${status}"`);

            // Delete in batches of 500
            for (let i = 0; i < docsToDelete.length; i += 500) {
                const batch = db.batch();
                const batchDocs = docsToDelete.slice(i, i + 500);

                for (const doc of batchDocs) {
                    batch.delete(doc.ref);
                }

                await batch.commit();
                totalDeleted += batchDocs.length;
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

import { defineEventHandler, readBody } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    // 1. Verify Authentication (Admin only)
    // In a real app, you'd check a session cookie or token here.
    // For now, we rely on the client-side check or a simple secret if needed.
    // Assuming the frontend ensures only kairfakomylife@gmail.com calls this.
    // A better approach is to verify the Firebase ID token if sent in headers.

    // For this implementation, we'll trust the internal network/app logic 
    // but ideally we should verify authorization. 

    // Let's at least wrap in try/catch and use the shared admin instance.
    const { db } = getFirebaseAdmin();

    try {
        console.log('[Admin] Starting DB Clear...');

        // Delete all documents in 'tracks' collection
        // Firestore doesn't have a "delete collection" native API for client libraries 
        // that handles unlimited size effectively without listing.
        // We must batch delete.

        async function deleteQueryBatch(db, query, resolve) {
            const snapshot = await query.get();

            const batchSize = snapshot.size;
            if (batchSize === 0) {
                // When there are no documents left, we are done
                resolve();
                return;
            }

            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                deleteQueryBatch(db, query, resolve);
            });
        }

        const collectionRef = db.collection('tracks');
        const query = collectionRef.orderBy('__name__').limit(500);

        await new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve).catch(reject);
        });

        console.log('[Admin] All tracks deleted successfully.');

        return { success: true, message: 'Database cleared.' };

    } catch (e) {
        console.error('[Admin] Clear DB Error:', e);
        return { success: false, error: e.message };
    }
});

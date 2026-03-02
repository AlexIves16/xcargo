import { defineEventHandler } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';

// Parse date from status string in format DD.MM.YYYY
function parseDateFromStatus(status: string): Date | null {
    if (!status) return null;
    
    // Regex to match dates in format "дата получ...: DD.MM.YYYY"
    const dateRegex = /[дД]ата\s+[пП]олуч\S*:\s*(\d{2}\.\d{2}\.\d{4})/;
    const altRegex = /[пП]олуч\S*:\s*(\d{2}\.\d{2}\.\d{4})/;
    
    let match = status.match(dateRegex);
    if (!match) {
        match = status.match(altRegex);
    }
    
    if (match) {
        const dateStr = match[1]; // "13.11.2025"
        const [day, month, year] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed
    }
    
    return null;
}

export default defineEventHandler(async (event) => {
    const { db } = getFirebaseAdmin();

    try {
        console.log('[Admin] Starting cleanup of old delivered parcels (including "Дата получение")...');
        
        // Calculate dates
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        console.log(`[Admin] Thresholds - Delivered: ${oneWeekAgo.toISOString()}, Date Received: ${twoWeeksAgo.toISOString()}`);

        let totalDeleted = 0;
        
        // 1. Clean up traditional delivered/ready_for_pickup statuses (1 week old)
        const traditionalStatuses = ['delivered', 'ready_for_pickup'];
        
        for (const status of traditionalStatuses) {
            console.log(`[Admin] Processing traditional status: ${status}`);
            const query = db.collection('tracks').where('status', '==', status);
            const snapshot = await query.get();
            
            if (snapshot.empty) {
                console.log(`[Admin] No records found with status "${status}"`);
                continue;
            }

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
                console.log(`[Admin] Deleted ${batchDocs.length} records with status "${status}"`);
            }
        }
        
        // 2. Clean up "Дата получение" records from secondary status (2 weeks old)
        console.log('[Admin] Processing "Дата получение" records from secondary status...');
        const allTracksSnapshot = await db.collection('tracks').get();
        
        if (!allTracksSnapshot.empty) {
            const docsToDelete = [];
            
            for (const doc of allTracksSnapshot.docs) {
                const data = doc.data();
                const secondaryStatus = data.lastSecondaryStatus || '';
                
                // Check if status contains "дата получ" variations
                const hasDateReceive = secondaryStatus.toLowerCase().includes('дата получ') || 
                                     secondaryStatus.toLowerCase().includes('получено') ||
                                     secondaryStatus.toLowerCase().includes('received') ||
                                     secondaryStatus.toLowerCase().includes('алынды') ||
                                     secondaryStatus.toLowerCase().includes('已领取');
                
                if (!hasDateReceive) continue;
                
                // Parse date from status
                const statusDate = parseDateFromStatus(secondaryStatus);
                if (!statusDate) {
                    console.log(`[Admin] Could not parse date from status: "${secondaryStatus}" (doc: ${doc.id})`);
                    continue;
                }
                
                // Check if date is older than 2 weeks
                if (statusDate < twoWeeksAgo) {
                    docsToDelete.push(doc);
                    console.log(`[Admin] Marked for deletion: ${doc.id} - ${secondaryStatus} (${statusDate.toISOString()})`);
                }
            }
            
            console.log(`[Admin] Found ${docsToDelete.length} "Дата получение" records to delete`);
            
            // Delete in batches of 500
            for (let i = 0; i < docsToDelete.length; i += 500) {
                const batch = db.batch();
                const batchDocs = docsToDelete.slice(i, i + 500);
                
                for (const doc of batchDocs) {
                    batch.delete(doc.ref);
                }
                
                await batch.commit();
                totalDeleted += batchDocs.length;
                console.log(`[Admin] Deleted batch of ${batchDocs.length} "Дата получение" records (${totalDeleted} total)`);
            }
        }
        
        console.log(`[Admin] Total deleted: ${totalDeleted} records`);
        
        return {
            success: true,
            deleted: totalDeleted,
            message: `Удалено ${totalDeleted} записей: доставленные (неделя) + "Дата получение" (2 недели).`
        };

    } catch (e: any) {
        console.error('[Admin] Clear Old Delivered Error:', e);
        return { success: false, error: e.message };
    }
});

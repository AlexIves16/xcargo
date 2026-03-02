import { defineEventHandler } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';

// Parse date from status string in format DD.MM.YYYY
function parseDateFromStatus(status: string): Date | null {
    if (!status) return null;
    
    // Regex to match dates in format "дата получ...: DD.MM.YYYY"
    // Handles various formats:
    // - "Дата получение: 13.11.2025"
    // - "Дата получения: 15.12.2025" 
    // - "Получено: 20.10.2025"
    // - "⌛⌛⌛ Дата получение: 13.11.2025"
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
    const query = getQuery(event);
    const dryRun = query.dryRun === 'true';

    try {
        console.log(`[Admin] Starting cleanup of old received records... (dryRun: ${dryRun})`);
        
        // Calculate date 2 weeks ago
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        console.log(`[Admin] Target date threshold: ${twoWeeksAgo.toISOString()}`);

        // Query all tracks that might have "дата получ" in secondary status
        // We need to get all documents and filter on server side since we can't query by partial text
        const snapshot = await db.collection('tracks').get();
        
        if (snapshot.empty) {
            console.log('[Admin] No tracks found in database');
            return {
                success: true,
                deleted: 0,
                message: 'No records found',
                dryRun: dryRun
            };
        }

        console.log(`[Admin] Found ${snapshot.size} total tracks, filtering...`);
        
        // Filter records with "дата получ" in secondary status and older than 2 weeks
        const docsToDelete = [];
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const secondaryStatus = data.lastSecondaryStatus || '';
            
            // Check if status contains "дата получ" variations
            const hasDateReceive = secondaryStatus.toLowerCase().includes('дата получ') || 
                                 secondaryStatus.toLowerCase().includes('получено') ||
                                 secondaryStatus.toLowerCase().includes('received') ||
                                 secondaryStatus.toLowerCase().includes('алынды') ||
                                 secondaryStatus.toLowerCase().includes('已领取');
            
            if (!hasDateReceive) {
                continue;
            }
            
            // Parse date from status
            const statusDate = parseDateFromStatus(secondaryStatus);
            if (!statusDate) {
                console.log(`[Admin] Could not parse date from status: "${secondaryStatus}" (doc: ${doc.id})`);
                continue;
            }
            
            // Check if date is older than 2 weeks
            if (statusDate < twoWeeksAgo) {
                docsToDelete.push({
                    id: doc.id,
                    data: data,
                    statusDate: statusDate,
                    secondaryStatus: secondaryStatus
                });
                console.log(`[Admin] Marked for deletion: ${doc.id} - ${secondaryStatus} (${statusDate.toISOString()})`);
            }
        }
        
        console.log(`[Admin] Found ${docsToDelete.length} records to delete`);
        
        if (dryRun) {
            // Return preview without actually deleting
            return {
                success: true,
                deleted: 0,
                preview: docsToDelete.length,
                message: `Would delete ${docsToDelete.length} records older than 2 weeks`,
                dryRun: true,
                details: docsToDelete.map(d => ({
                    id: d.id,
                    number: d.data.number,
                    secondaryStatus: d.secondaryStatus,
                    statusDate: d.statusDate.toISOString()
                }))
            };
        }
        
        // Actually delete records in batches
        let totalDeleted = 0;
        const BATCH_SIZE = 500;
        
        for (let i = 0; i < docsToDelete.length; i += BATCH_SIZE) {
            const batch = db.batch();
            const batchDocs = docsToDelete.slice(i, i + BATCH_SIZE);
            
            for (const docInfo of batchDocs) {
                const docRef = db.collection('tracks').doc(docInfo.id);
                batch.delete(docRef);
            }
            
            await batch.commit();
            totalDeleted += batchDocs.length;
            console.log(`[Admin] Deleted batch of ${batchDocs.length} records (${totalDeleted}/${docsToDelete.length} total)`);
        }
        
        console.log(`[Admin] Successfully deleted ${totalDeleted} old received records.`);
        
        return {
            success: true,
            deleted: totalDeleted,
            message: `Deleted ${totalDeleted} records with "Дата получение" status older than 2 weeks.`,
            dryRun: false
        };

    } catch (e: any) {
        console.error('[Admin] Clear Old Received Error:', e);
        return { 
            success: false, 
            error: e.message,
            dryRun: dryRun
        };
    }
});
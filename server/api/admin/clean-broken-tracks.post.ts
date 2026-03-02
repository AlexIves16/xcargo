import { defineEventHandler } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';
import { Timestamp } from 'firebase-admin/firestore';

// Validate track number format (letters, numbers, spaces, hyphens only)
function isValidTrackNumber(trackNum: string): boolean {
    if (!trackNum || trackNum.trim().length === 0) return false;
    // Allow only letters, numbers, spaces, and hyphens
    const validPattern = /^[a-zA-Z0-9\s-]+$/;
    return validPattern.test(trackNum.trim());
}

export default defineEventHandler(async (event) => {
    const { db } = getFirebaseAdmin();
    
    try {
        console.log('[CleanBrokenTracks] Starting cleanup of broken track records...');
        
        // Get all tracks from Firestore
        const snapshot = await db.collection('tracks').get();
        let totalProcessed = 0;
        let totalDeleted = 0;
        const brokenRecords = [];
        
        // Process in batches of 500
        const batch = db.batch();
        let opsCount = 0;
        
        for (const doc of snapshot.docs) {
            totalProcessed++;
            const data = doc.data();
            const trackNumber = data.number;
            
            // Check if track number is invalid
            if (!trackNumber || typeof trackNumber !== 'string' || !isValidTrackNumber(trackNumber)) {
                console.log(`[CleanBrokenTracks] Found broken record: ${doc.id} with number: "${trackNumber}"`);
                brokenRecords.push({ id: doc.id, number: trackNumber });
                
                // Add delete operation to batch
                batch.delete(doc.ref);
                opsCount++;
                
                totalDeleted++;
                
                // Execute batch every 500 operations to avoid Firestore limits
                if (opsCount >= 500) {
                    console.log(`[CleanBrokenTracks] Executing batch with ${opsCount} delete operations...`);
                    await batch.commit();
                    
                    // Create new batch
                    opsCount = 0;
                }
            }
        }
        
        // Execute remaining operations
        if (opsCount > 0) {
            console.log(`[CleanBrokenTracks] Executing final batch with ${opsCount} delete operations...`);
            await batch.commit();
        }
        
        console.log(`[CleanBrokenTracks] Cleanup completed. Processed: ${totalProcessed}, Deleted: ${totalDeleted}`);
        
        return {
            success: true,
            message: `Cleanup completed. Processed: ${totalProcessed}, Deleted: ${totalDeleted} broken records.`,
            processed: totalProcessed,
            deleted: totalDeleted,
            sampleBrokenRecords: brokenRecords.slice(0, 10) // Return first 10 broken records as sample
        };
        
    } catch (e: any) {
        console.error('[CleanBrokenTracks] Error:', e);
        return { success: false, error: e.message };
    }
});

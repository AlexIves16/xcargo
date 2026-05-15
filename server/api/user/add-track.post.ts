import { defineEventHandler, readBody } from 'h3';
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
    const body = await readBody(event);
    const { number, description, userId, userEmail, userName } = body;

    if (!number || !userId) {
        return { success: false, error: 'Missing required fields' };
    }

    // Validate track number format
    if (!isValidTrackNumber(number)) {
        return { success: false, error: 'Invalid track number format. Only letters, numbers, spaces, and hyphens are allowed.' };
    }

    const { db } = getFirebaseAdmin();
    const trackNum = number.trim();

    try {
        const tracksRef = db.collection('tracks');
        const userTracksRef = db.collection('user_tracks');
        const trackNumNorm = trackNum.toUpperCase();

        console.log(`[AddTrack] User ${userId} adding track: '${trackNumNorm}'`);

        // 1. Check if this user already added this track to their list
        const existingClaim = await userTracksRef
            .where('userId', '==', userId)
            .where('number', '==', trackNumNorm)
            .limit(1)
            .get();

        if (!existingClaim.empty) {
            return { success: true, message: 'Track already in your list', trackId: existingClaim.docs[0].id };
        }

        // 2. Add to user's personal list
        await userTracksRef.add({
            userId,
            userEmail: userEmail || '',
            userName: userName || 'Пользователь',
            number: trackNumNorm,
            description: description || '',
            addedAt: Timestamp.now()
        });

        // 3. Ensure the track exists in the main 'tracks' table (admin view)
        const trackQuery = await tracksRef.where('number', '==', trackNumNorm).limit(1).get();
        
        if (trackQuery.empty) {
            await tracksRef.add({
                number: trackNumNorm,
                status: 'pending',
                description: description || '',
                userName: userName || 'Пользователь',
                userEmail: userEmail || '',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
        } else {
            const trackDoc = trackQuery.docs[0];
            const trackData = trackDoc.data();
            
            // Only update with user info if it's currently generic
            if (!trackData.userName || trackData.userName === 'Пользователь') {
                await trackDoc.ref.update({
                    userName: userName || 'Пользователь',
                    userEmail: userEmail || '',
                    description: trackData.description || description || '',
                    updatedAt: Timestamp.now()
                });
            }
        }

        return { success: true, message: 'Track added to your list' };

    } catch (e: any) {
        console.error('Add Track Error:', e);
        return { success: false, error: e.message };
    }
});

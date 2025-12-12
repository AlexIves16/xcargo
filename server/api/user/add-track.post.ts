import { defineEventHandler, readBody } from 'h3';
import { getFirebaseAdmin } from '../../utils/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { number, description, userId, userEmail, userName } = body;

    if (!number || !userId) {
        return { success: false, error: 'Missing required fields' };
    }

    const { db } = getFirebaseAdmin();
    const trackNum = number.trim();

    try {
        const tracksRef = db.collection('tracks');
        const trackNum = number.trim();
        const trackNumUpper = trackNum.toUpperCase();

        console.log(`[AddTrack] Searching for: '${trackNum}' (Upper: '${trackNumUpper}')`);

        // 1. Try Exact Match
        let q = tracksRef.where('number', '==', trackNum).limit(1);
        let snapshot = await q.get();

        // 2. Fallback: Try Uppercase Match (if different)
        if (snapshot.empty && trackNum !== trackNumUpper) {
            console.log('[AddTrack] Exact match failed. Trying uppercase...');
            q = tracksRef.where('number', '==', trackNumUpper).limit(1);
            snapshot = await q.get();
        }

        if (!snapshot.empty) {
            // Track exists! Claim it!
            const doc = snapshot.docs[0];
            const data = doc.data();
            console.log(`[AddTrack] Found existing track: ${doc.id}`);

            // Check if already claimed by SOMEONE ELSE
            if (data.userId && data.userId !== userId) {
                return { success: false, error: 'Трек-номер уже добавлен другим пользователем.' };
            }

            if (data.userId === userId) {
                // Already yours, just return success
                return { success: true, message: 'Track already added', trackId: doc.id };
            }

            // Claim it
            await doc.ref.update({
                userId: userId,
                userEmail: userEmail || '',
                userName: userName || 'Пользователь',
                description: description || '',
                updatedAt: Timestamp.now()
            });

            return { success: true, message: 'Track claimed', trackId: doc.id };

        } else {
            console.log('[AddTrack] Not found. Creating new...');
            // Track does not exist. Create new.
            // Always save as trim() raw? Or normalize to Upper? 
            // Better to save as Upper to keep consistency if that's the standard.
            // But let's respect user input usually, unless we enforce upper.
            // Let's us Upper for the new track number for consistency if we couldn't find it.
            // Actually, if we save as Upper, future syncs must also use Upper. 
            // Sheets sync uses raw string from sheet. 
            // Let's stick to trackNum (trimmed input) to avoid mismatch with Sheet if Sheet has lowercase.

            const newDoc = await tracksRef.add({
                number: trackNum, // or trackNumUpper?
                description: description || '',
                userId: userId,
                userEmail: userEmail || '',
                userName: userName || 'Пользователь',
                status: 'pending',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                history: []
            });

            return { success: true, message: 'Track created', trackId: newDoc.id };
        }
    } catch (e: any) {
        console.error('Add Track Error:', e);
        return { success: false, error: e.message };
    }
});

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
        const q = tracksRef.where('number', '==', trackNum).limit(1);
        const snapshot = await q.get();

        if (!snapshot.empty) {
            // Track exists! Claim it!
            const doc = snapshot.docs[0];
            const data = doc.data();

            // Check if already claimed by SOMEONE ELSE
            if (data.userId && data.userId !== userId) {
                return { success: false, error: 'Трек-номер уже добавлен другим пользователем.' };
            }

            if (data.userId === userId) {
                return { success: false, error: 'Вы уже добавили этот трек-номер.' };
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
            // Track does not exist. Create new.
            const newDoc = await tracksRef.add({
                number: trackNum,
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

    } catch (e) {
        console.error('Add Track Error:', e);
        return { success: false, error: e.message };
    }
});

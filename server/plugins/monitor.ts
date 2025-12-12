import { getFirebaseAdmin } from '../utils/firebase';

export default defineNitroPlugin((nitroApp) => {
    console.log('Stats Monitor: Plugin Initialized');

    // Run check every 30 minutes
    const CHECK_INTERVAL = 30 * 60 * 1000;

    const runDailyCheck = async () => {
        try {
            const now = new Date();
            const currentHour = now.getHours();

            // Only proceed if it's 9 AM or later (server time)
            // Adjust hour as needed (e.g., 9 for 9 AM UTC/Server time)
            if (currentHour < 9 || currentHour > 23) return;

            const { db } = getFirebaseAdmin();
            const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

            // Check lock in DB
            const metaRef = db.collection('system_metadata').doc('alerts');
            const docSnap = await metaRef.get();

            if (docSnap.exists) {
                const data = docSnap.data();
                if (data && data.lastAlertDate === todayStr) {
                    // Already ran today
                    return;
                }
            }

            console.log('Stats Monitor: Running Daily Check...');
            const stats = await getSystemStats();
            console.log('Stats Monitor: Current Stats:', stats);

            const LIMIT = 20000;
            let alertNeeded = false;
            let message = '<h2>Оповещение о лимитах базы данных</h2><ul>';

            if (stats.db >= LIMIT) {
                alertNeeded = true;
                message += `<li>🔴 <strong>База данных (Firestore):</strong> ${stats.db} записей (Лимит: ${LIMIT})</li>`;
            } else {
                message += `<li>🟢 База данных (Firestore): ${stats.db} записей</li>`;
            }

            if (stats.sheet >= LIMIT) {
                alertNeeded = true;
                message += `<li>🔴 <strong>Google Таблица:</strong> ${stats.sheet} строк (Лимит: ${LIMIT})</li>`;
            } else {
                message += `<li>🟢 Google Таблица: ${stats.sheet} строк</li>`;
            }

            message += '</ul>';

            if (alertNeeded) {
                console.log('Stats Monitor: Limit exceeded. Sending email...');
                const sent = await sendAlertEmail('⚠️ ПРЕВЫШЕНИЕ ЛИМИТА ЗАПИСЕЙ (Xcargo)', message);

                if (sent) {
                    // Update DB to prevent duplicate sends
                    await metaRef.set({ lastAlertDate: todayStr }, { merge: true });
                }
            } else {
                console.log('Stats Monitor: Limits OK. No email sent.');
                // Mark as checked to prevent repeated checks today?
                // If we want to alert ONLY when limit exceeded, we only mark if we sent email?
                // Or if we verified it's OK? 
                // Better to check every time if we haven't sent yet? 
                // If limit is OK, we don't send status update.
                // But users wants "email... until indicators stop being red".
                // So if > 20k, send. 
                // We should record run for today regardless, IF we want strictly one check.
                // But if stats GO ABOVE limit later in day, maybe we want to know?
                // User said "come every day, once a day".
                // So once we check and its > 20k, we send.
                // If we check and its < 20k, do we mark as done? 
                // If we mark as done, and it goes > 20k at 5 PM, we won't know until tomorrow.
                // If we DON'T mark as done, we keep checking.
                // Let's safe-guard: if we send email, mark as done.
                // If we don't send, maybe we check again later.
                // This seems safest.
            }

        } catch (e) {
            console.error('Stats Monitor: Error executing check', e);
        }
    };

    // Initial run after short delay
    setTimeout(runDailyCheck, 10000);

    // Loop
    setInterval(runDailyCheck, CHECK_INTERVAL);
});

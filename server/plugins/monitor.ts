import cron from 'node-cron';

export default defineNitroPlugin((nitroApp) => {
    console.log('Stats Monitor: Plugin Initialized');

    // Schedule: Every day at 9:00 AM (server time)
    // Format: Minute Hour Day Month Weekday
    cron.schedule('0 9 * * *', async () => {
        console.log('Stats Monitor: Running Daily Check...');

        try {
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
                await sendAlertEmail('⚠️ ПРЕВЫШЕНИЕ ЛИМИТА ЗАПИСЕЙ (Xcargo)', message);
            } else {
                console.log('Stats Monitor: Limits OK. No email sent.');
            }

        } catch (e) {
            console.error('Stats Monitor: Error executing check', e);
        }
    });
});

import { defineEventHandler, readBody, createError } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { pendingTokens } from './auth/telegram-init.post';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    console.log('📩 Telegram webhook received:', JSON.stringify(body).substring(0, 200));

    if (!body) {
        return { ok: true };
    }

    // Handle callback query (button press) FIRST - before message check!
    if (body.callback_query) {
        const callbackData = body.callback_query.data || '';
        const callbackUser = body.callback_query.from;
        const chatId = body.callback_query.message?.chat?.id;

        console.log('🔘 Callback query received:', callbackData);

        if (callbackData.startsWith('confirm_auth_')) {
            const token = callbackData.replace('confirm_auth_', '');
            console.log('✅ Confirming auth token:', token);

            const tokenData = pendingTokens.get(token);

            if (!tokenData) {
                console.log('❌ Token not found or expired');
                await answerCallbackQuery(
                    config.telegramBotToken as string,
                    body.callback_query.id,
                    '❌ Ссылка устарела'
                );
                return { ok: true };
            }

            try {
                // Initialize Firebase Admin
                let app;
                const apps = getApps();

                let privateKey = config.googlePrivateKey as string;
                privateKey = privateKey.replace(/\\n/g, '\n');

                if (apps.length === 0) {
                    app = initializeApp({
                        credential: cert({
                            projectId: config.public.firebaseProjectId as string,
                            clientEmail: config.googleClientEmail as string,
                            privateKey: privateKey,
                        }),
                    });
                } else {
                    app = getApp();
                }

                const auth = getAuth(app);
                const uid = `tg_${callbackUser.id}`;

                // Get user profile photo from Telegram
                let photoURL: string | undefined;
                try {
                    const photosResponse = await fetch(
                        `https://api.telegram.org/bot${config.telegramBotToken}/getUserProfilePhotos?user_id=${callbackUser.id}&limit=1`
                    );
                    const photosData = await photosResponse.json();

                    if (photosData.ok && photosData.result.total_count > 0) {
                        const fileId = photosData.result.photos[0][0].file_id;

                        // Get file path
                        const fileResponse = await fetch(
                            `https://api.telegram.org/bot${config.telegramBotToken}/getFile?file_id=${fileId}`
                        );
                        const fileData = await fileResponse.json();

                        if (fileData.ok) {
                            photoURL = `https://api.telegram.org/file/bot${config.telegramBotToken}/${fileData.result.file_path}`;
                            console.log('📷 Got user photo:', photoURL);
                        }
                    }
                } catch (e) {
                    console.log('Could not fetch user photo:', e);
                }

                // Create or update user
                try {
                    await auth.updateUser(uid, {
                        displayName: `${callbackUser.first_name} ${callbackUser.last_name || ''}`.trim(),
                        photoURL: photoURL,
                    });
                } catch (error: any) {
                    if (error.code === 'auth/user-not-found') {
                        await auth.createUser({
                            uid: uid,
                            displayName: `${callbackUser.first_name} ${callbackUser.last_name || ''}`.trim(),
                            photoURL: photoURL,
                        });
                    } else {
                        throw error;
                    }
                }

                // Create custom token
                const firebaseToken = await auth.createCustomToken(uid, {
                    telegramId: callbackUser.id.toString(),
                    username: callbackUser.username,
                });

                // Mark token as confirmed
                tokenData.confirmed = true;
                tokenData.userId = callbackUser.id;
                tokenData.userData = {
                    id: callbackUser.id,
                    first_name: callbackUser.first_name,
                    last_name: callbackUser.last_name,
                    username: callbackUser.username,
                };
                tokenData.firebaseToken = firebaseToken;

                console.log('🎉 Auth confirmed for user:', callbackUser.id);

                // Answer callback and update message
                await answerCallbackQuery(
                    config.telegramBotToken as string,
                    body.callback_query.id,
                    '✅ Вход подтверждён!'
                );

                await sendTelegramMessage(
                    config.telegramBotToken as string,
                    chatId,
                    '✅ Вход подтверждён! Вернитесь на сайт.'
                );

            } catch (error) {
                console.error('Error creating Firebase token:', error);
                await answerCallbackQuery(
                    config.telegramBotToken as string,
                    body.callback_query.id,
                    '❌ Ошибка авторизации'
                );
            }
        }

        return { ok: true };
    }

    // Handle regular messages
    if (!body.message) {
        return { ok: true };
    }

    const message = body.message;
    const text = message.text || '';
    const user = message.from;

    // Handle /start command with auth token
    if (text.startsWith('/start auth_')) {
        const token = text.replace('/start auth_', '').trim();
        console.log('🔐 Processing auth token:', token);

        const tokenData = pendingTokens.get(token);

        if (!tokenData) {
            await sendTelegramMessage(
                config.telegramBotToken as string,
                message.chat.id,
                '❌ Ссылка для входа устарела. Пожалуйста, попробуйте снова на сайте.'
            );
            return { ok: true };
        }

        // Send confirmation button
        await sendTelegramMessage(
            config.telegramBotToken as string,
            message.chat.id,
            `👋 Привет, ${user.first_name}!\n\nПодтвердите вход на сайт Xpress Cargo:`,
            {
                inline_keyboard: [[
                    { text: '✅ Подтвердить вход', callback_data: `confirm_auth_${token}` }
                ]]
            }
        );

        return { ok: true };
    }

    return { ok: true };
});

// Helper function to send Telegram message
async function sendTelegramMessage(
    botToken: string,
    chatId: number,
    text: string,
    replyMarkup?: any
) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            reply_markup: replyMarkup
        })
    });
}

// Helper function to answer callback query
async function answerCallbackQuery(botToken: string, callbackQueryId: string, text: string) {
    const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;

    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            callback_query_id: callbackQueryId,
            text: text
        })
    });
}

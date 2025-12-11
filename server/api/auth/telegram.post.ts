import { defineEventHandler, readBody, createError } from 'h3';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    // DEBUG: Log config to see what's available
    console.log('🔍 SERVER DEBUG: runtimeConfig keys:', Object.keys(config));
    console.log('🔍 SERVER DEBUG: telegramBotToken exists:', !!config.telegramBotToken);
    console.log('🔍 SERVER DEBUG: googleClientEmail:', config.googleClientEmail);
    console.log('🔍 SERVER DEBUG: googlePrivateKey exists:', !!config.googlePrivateKey);
    console.log('🔍 SERVER DEBUG: googlePrivateKey length:', config.googlePrivateKey?.length || 0);

    if (!body) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }

    const token = config.telegramBotToken;
    if (!token) {
        console.error('❌ SERVER ERROR: TELEGRAM_BOT_TOKEN is empty!');
        throw createError({ statusCode: 500, statusMessage: 'Telegram Bot Token not configured' });
    }

    let userData: any = {};
    let telegramId: string = '';

    // CASE 1: Telegram Mini App (TMA) - initData
    if (body.initData) {
        const initData = new URLSearchParams(body.initData);
        const hash = initData.get('hash');
        const dataToCheck: string[] = [];

        initData.sort();
        initData.forEach((val, key) => {
            if (key !== 'hash') {
                dataToCheck.push(`${key}=${val}`);
            }
        });

        // Secret key for WebApp is HMAC-SHA256("WebAppData", token)
        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
        const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataToCheck.join('\n')).digest('hex');

        if (calculatedHash !== hash) {
            throw createError({ statusCode: 403, statusMessage: 'Invalid TMA hash' });
        }

        const userStr = initData.get('user');
        if (!userStr) throw createError({ statusCode: 400, statusMessage: 'No user data in initData' });

        const user = JSON.parse(userStr);
        userData = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            photo_url: user.photo_url
        };
        telegramId = user.id.toString();
    }
    // CASE 2: Login Widget
    else if (body.id && body.hash) {
        const { hash, ...data } = body;
        const dataCheckString = Object.keys(data)
            .sort()
            .map((key) => `${key}=${data[key]}`)
            .join('\n');

        // Secret key for Widget is SHA256(token)
        const secretKey = crypto.createHash('sha256').update(token).digest();
        const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        if (calculatedHash !== hash) {
            throw createError({ statusCode: 403, statusMessage: 'Invalid Widget hash' });
        }

        userData = data;
        telegramId = data.id.toString();
    } else {
        throw createError({ statusCode: 400, statusMessage: 'Unknown auth method' });
    }

    // --- Firebase Logic ---

    // Initialize Firebase Admin
    let app;
    const apps = getApps();

    // Fix private key format - handle various escape scenarios
    let privateKey = config.googlePrivateKey as string;
    console.log('🔍 SERVER DEBUG: raw privateKey length:', privateKey.length);
    console.log('🔍 SERVER DEBUG: raw privateKey first 60 chars:', JSON.stringify(privateKey.substring(0, 60)));

    // Try multiple replacement patterns
    privateKey = privateKey.replace(/\\n/g, '\n');   // literal \n

    console.log('🔍 SERVER DEBUG: processed privateKey first 60 chars:', JSON.stringify(privateKey.substring(0, 60)));

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

    const uid = `tg_${telegramId}`;
    const auth = getAuth(app);

    try {
        // Create or update user
        try {
            await auth.updateUser(uid, {
                displayName: `${userData.first_name} ${userData.last_name || ''}`.trim(),
                photoURL: userData.photo_url || undefined,
            });
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                await auth.createUser({
                    uid: uid,
                    displayName: `${userData.first_name} ${userData.last_name || ''}`.trim(),
                    photoURL: userData.photo_url || undefined,
                });
            } else {
                throw error;
            }
        }

        const customToken = await auth.createCustomToken(uid, {
            telegramId: telegramId,
            username: userData.username,
        });

        return { token: customToken };
    } catch (error) {
        console.error('Error creating custom token:', error);
        throw createError({ statusCode: 500, statusMessage: 'Error generating token' });
    }
});

import { defineEventHandler, readBody, createError } from 'h3';
import crypto from 'crypto';
import { pendingTokens } from '../../utils/token-store';


export default defineEventHandler(async (event) => {
    // Generate a unique token
    const token = crypto.randomBytes(16).toString('hex');

    // Store token with creation time
    pendingTokens.set(token, {
        createdAt: Date.now(),
        confirmed: false
    });

    console.log('🔐 Created auth token:', token);

    return {
        token,
        // Deep link to open Telegram bot with auth parameter
        deepLink: `tg://resolve?domain=${process.env.TELEGRAM_BOT_NAME || 'xcargovbot'}&start=auth_${token}`
    };
});

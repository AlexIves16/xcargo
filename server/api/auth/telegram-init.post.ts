import { defineEventHandler, readBody, createError } from 'h3';
import crypto from 'crypto';

// In-memory store for pending auth tokens (in production, use Redis or similar)
// This is shared across the module
const pendingTokens = new Map<string, {
    createdAt: number;
    userId?: number;
    userData?: any;
    firebaseToken?: string;
    confirmed: boolean;
}>();

// Clean up expired tokens every minute
setInterval(() => {
    const now = Date.now();
    const TTL = 5 * 60 * 1000; // 5 minutes
    for (const [token, data] of pendingTokens) {
        if (now - data.createdAt > TTL) {
            pendingTokens.delete(token);
        }
    }
}, 60 * 1000);

// Export for use in other files
export { pendingTokens };

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

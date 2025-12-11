import { defineEventHandler, getQuery, createError } from 'h3';
import { pendingTokens } from './telegram-init.post';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const token = query.token as string;

    if (!token) {
        throw createError({ statusCode: 400, statusMessage: 'Token is required' });
    }

    const tokenData = pendingTokens.get(token);

    if (!tokenData) {
        return { status: 'expired' };
    }

    if (tokenData.confirmed && tokenData.firebaseToken) {
        // Clean up the token after successful retrieval
        pendingTokens.delete(token);

        return {
            status: 'confirmed',
            token: tokenData.firebaseToken,
            userData: tokenData.userData
        };
    }

    return { status: 'pending' };
});

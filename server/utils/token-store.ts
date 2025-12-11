
// Global token store to survive HMR/module reloads in dev
const globalStore = global as any;

if (!globalStore.__TELEGRAM_PENDING_TOKENS__) {
    globalStore.__TELEGRAM_PENDING_TOKENS__ = new Map<string, {
        createdAt: number;
        userId?: number;
        userData?: any;
        firebaseToken?: string;
        confirmed: boolean;
    }>();
}

export const pendingTokens = globalStore.__TELEGRAM_PENDING_TOKENS__ as Map<string, {
    createdAt: number;
    userId?: number;
    userData?: any;
    firebaseToken?: string;
    confirmed: boolean;
}>;

// Clean up expired tokens
if (!globalStore.__TOKEN_CLEANUP_INTERVAL__) {
    globalStore.__TOKEN_CLEANUP_INTERVAL__ = setInterval(() => {
        const now = Date.now();
        const TTL = 5 * 60 * 1000; // 5 minutes
        for (const [token, data] of pendingTokens) {
            if (now - data.createdAt > TTL) {
                pendingTokens.delete(token);
            }
        }
    }, 60 * 1000);
}

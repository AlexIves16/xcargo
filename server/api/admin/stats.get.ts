import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        console.log('[API] Stats request received');
        const stats = await getSystemStats();
        return {
            success: true,
            stats
        };
    } catch (e: any) {
        console.error('[API] Stats API Critical Error:', e);
        return {
            success: false,
            error: e.message || 'Unknown internal error'
        };
    }
});

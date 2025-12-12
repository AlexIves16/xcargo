import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const stats = await getSystemStats();
        return {
            success: true,
            stats
        };
    } catch (e: any) {
        console.error('Stats API Error:', e);
        return {
            success: false,
            error: e.message
        };
    }
});

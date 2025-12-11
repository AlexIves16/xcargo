
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const token = config.telegramBotToken;

    if (!token) {
        return {
            error: 'Telegram Token is not configured in runtimeConfig'
        };
    }

    try {
        const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            status: 'success',
            webhook_info: data,
            config_check: {
                has_token: !!token,
                token_length: token.length
            }
        };
    } catch (e: any) {
        return {
            status: 'error',
            message: e.message
        };
    }
});

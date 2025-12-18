import { defineEventHandler, getRequestURL } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const token = config.telegramBotToken;

    if (!token) {
        return {
            error: 'Telegram Token is not configured'
        };
    }

    // Get the current domain from the request
    const requestUrl = getRequestURL(event);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    const webhookUrl = `${baseUrl}/api/telegram-webhook`;

    try {
        // Set the webhook
        const setUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
        const response = await fetch(setUrl);
        const data = await response.json();

        return {
            status: 'success',
            message: 'Webhook updated',
            new_webhook_url: webhookUrl,
            telegram_response: data
        };
    } catch (e: any) {
        return {
            status: 'error',
            message: e.message
        };
    }
});

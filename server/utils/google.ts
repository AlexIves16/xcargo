import { google } from 'googleapis';

export const getGoogleAuth = async (scopes: string[]) => {
    const config = useRuntimeConfig();
    let privateKey = config.googlePrivateKey as string;
    const clientEmail = config.googleClientEmail as string;

    if (!privateKey || !clientEmail) {
        throw new Error('Google Auth: Missing credentials in config');
    }

    if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    const authClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: scopes
    });

    await authClient.authorize();
    return authClient;
};

export const getGoogleSheetsClient = async () => {
    const auth = await getGoogleAuth(['https://www.googleapis.com/auth/spreadsheets']);
    return google.sheets({ version: 'v4', auth: auth as any });
};

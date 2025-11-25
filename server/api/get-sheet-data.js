// server/api/getSheetData.js

import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  // Get credentials from environment variables
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  
  // ID Google Sheets
  const spreadsheetId = process.env.SPREADSHEET_ID || '1JofB8mYGEyfg8t0CbkZC0o-8GMKY0s63QqXRl3ddWVc';

  // Validate environment variables
  if (!clientEmail || !privateKey) {
    console.error('Missing Google service account credentials');
    return { error: 'Server configuration error' };
  }

  // Configure authentication using service account credentials
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    // Get authenticated client
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Get data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:E', // Extract all rows and columns from A to E
    });

    const rows = response.data.values;

    if (rows && rows.length) {
      const formattedData = rows
        .filter(row => row && row.length > 0) // Remove empty rows
        .map(row => row.map(cell => cell || '')); // Replace null/undefined with empty string
      // Return data
      return { data: formattedData };
    } else {
      return { error: 'Нет данных в таблице' };
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return { error: 'Не удалось получить данные из Google Sheets' };
  }
});
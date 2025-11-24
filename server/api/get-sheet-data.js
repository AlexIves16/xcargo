// server/api/getSheetData.js

import { google } from 'googleapis';
import path from 'path';

export default defineEventHandler(async (event) => {
  // Путь к файлу ключей сервисного аккаунта
  const keyFilePath = path.resolve('caramel-element-435516-g5-0f060438cf78.json');

  // ID Google Sheets
  const spreadsheetId = '1JofB8mYGEyfg8t0CbkZC0o-8GMKY0s63QqXRl3ddWVc';

  // Настраиваем аутентификацию с использованием ключа сервисного аккаунта
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    // Получаем клиент для аутентификации
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Получаем данные из Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:E', // Извлекаем все строки и столбцы от A до E
    });

    const rows = response.data.values;

    if (rows && rows.length) {
      const formattedData = rows
        .filter(row => row && row.length > 0) // Убираем пустые строки
        .map(row => row.map(cell => cell || '')); // Заменяем null/undefined на пустую строку
      // Возвращаем данные
      return { data: formattedData };
    } else {
      return { error: 'Нет данных в таблице' };
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return { error: 'Не удалось получить данные из Google Sheets' };
  }
});

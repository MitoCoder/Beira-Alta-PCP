import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: process.env.GOOGLE_TYPE,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Página1!A1:D',
    });

    const rows = response.data.values;
    if (rows.length) {
      const [headers, ...data] = rows;
      const formatted = data.map((row) =>
        headers.reduce((acc, header, i) => {
          acc[header] = row[i] || '';
          return acc;
        }, {})
      );
      res.status(200).json({ data: formatted });
    } else {
      res.status(200).json({ data: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao acessar a planilha' });
  }
}

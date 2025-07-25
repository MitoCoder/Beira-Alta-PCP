import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets'] // Permissão total
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'dados!A2:D', // Pula cabeçalho, pega só dados
    });

    const rows = response.data.values || [];
    const data = rows.map((row) => ({
      id: row[0],
      produto: row[1],
      quantidade: row[2],
      data: row[3],
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error('Erro ao acessar a planilha:', error);
    res.status(500).json({ error: 'Erro ao acessar a planilha' });
  }
}

import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id, produto, quantidade, data } = req.body;

  if (!id || !produto || !quantidade || !data) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'dados!A2:D',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[id, produto, quantidade, data]],
      },
    });

    res.status(200).json({ message: 'Dados adicionados com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar dados:', error);
    res.status(500).json({ error: 'Erro ao adicionar dados' });
  }
}

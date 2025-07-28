import fetch from 'node-fetch';

const GAS_URL = 'api-controle-ecru.vercel.app';

export default async function handler(req, res) {
  try {
    const method = req.method;
    let response;

    if (method === 'GET') {
      // Repasse GET com query params
      const query = new URLSearchParams(req.query).toString();
      response = await fetch(`${GAS_URL}?${query}`);
    } else if (method === 'POST') {
      // Repasse POST com body
      response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const data = await response.json();

    // Seta cabeçalho CORS para liberar acesso do front-end
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

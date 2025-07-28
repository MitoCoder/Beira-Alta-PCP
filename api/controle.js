import fetch from 'node-fetch'; // Import necessário para chamadas fetch no Node.js

export default async function handler(req, res) {
  const { method, body, query } = req;

  const API_URL = 'https://script.google.com/macros/s/AKfycby0P9N46bP4eYXVxUAojEcwjgtpIdg0M_f_6F8bZCDnziutKd7tGyUVcs59wp39ejR8/exec'; // Substitua pelo seu ID

  try {
    if (method === 'GET') {
      const response = await fetch(`${API_URL}?action=read`);
      const data = await response.json();
      return res.status(200).json(data);
    } else if (method === 'POST') {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

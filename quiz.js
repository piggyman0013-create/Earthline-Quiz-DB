// Vercel Serverless Function — proxy to Google Apps Script
// Server-to-server: no CORS restriction

const GAS_URL = 'https://script.google.com/macros/s/AKfycbybsTp_O1oNMX4trh-FnSxzZnqJMFlQLrXHarnNyrEu8rG43a8xumHeYOBhEvXmRw5a/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let url = GAS_URL;

    if (req.method === 'POST') {
      const payload = encodeURIComponent(JSON.stringify(req.body));
      url = `${GAS_URL}?payload=${payload}`;
    } else {
      const qs = new URLSearchParams(req.query).toString();
      if (qs) url = `${GAS_URL}?${qs}`;
    }

    const response = await fetch(url, { redirect: 'follow' });
    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

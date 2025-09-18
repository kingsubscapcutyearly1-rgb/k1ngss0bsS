export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // For demo, just echo back. In production save to DB or send to webhook.
  const payload = req.body || {};
  return res.status(200).json({ ok: true, saved: true, payload });
}



module.exports = async function handler(req, res) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'gallery';

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary environment variables are missing.' });
  }

  const expression = `folder:${folder}`;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression,
        sort_by: [{ public_id: 'desc' }],
        max_results: 30,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: 'Cloudinary search failed', detail: text });
    }

    const payload = await response.json();
    const images = (payload.resources || []).map(r => ({
      url: r.secure_url,
      public_id: r.public_id,
      format: r.format,
      width: r.width,
      height: r.height,
      created_at: r.created_at,
    }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ images });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: err.message });
  }
};

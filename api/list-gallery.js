module.exports = async function handler(req, res) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'gallery';

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary environment variables are missing.' });
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?type=upload&prefix=${folder}/&max_results=30`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: 'Cloudinary API failed', detail: text, status: response.status });
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

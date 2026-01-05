module.exports = async function handler(req, res) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  // Only use folder if explicitly set; empty string = get all images
  const folder = process.env.CLOUDINARY_FOLDER ?? null;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary environment variables are missing.' });
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?type=upload&max_results=50`;
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
    
    // Debug: show what we got
    if (!payload.resources || payload.resources.length === 0) {
      return res.status(200).json({ 
        debug: 'No resources returned from Cloudinary',
        rawPayload: payload 
      });
    }

    // Filter by folder prefix on the response
    const allImages = payload.resources.map(r => ({
      url: r.secure_url,
      public_id: r.public_id,
      format: r.format,
      width: r.width,
      height: r.height,
      created_at: r.created_at,
    }));

    const filtered = allImages.filter(r => !folder || r.public_id.startsWith(folder + '/'));
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ images: filtered });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: err.message });
  }
};

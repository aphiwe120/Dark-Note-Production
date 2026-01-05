document.addEventListener('DOMContentLoaded', () => {
    const galleryEl = document.getElementById('gallery');
    const galleryStatusEl = document.getElementById('galleryStatus');

    const renderGallery = images => {
        if (!galleryEl) return;
        galleryEl.innerHTML = '';
        images.forEach(img => {
            const card = document.createElement('div');
            card.className = 'gallery-item';

            const image = document.createElement('img');
            image.src = img.url;
            image.alt = img.alt || img.public_id || 'Event photo';

            const caption = document.createElement('p');
            caption.textContent = img.caption || img.public_id?.split('/').pop() || 'Event';

            card.appendChild(image);
            card.appendChild(caption);
            galleryEl.appendChild(card);
        });
    };

    const fallbackImages = [
        { url: 'images/Sound,AUDIOvisual,Stage.jpg', public_id: 'IFP Rally', caption: 'IFP Rally' },
        { url: 'images/Audio visual3.jpg', public_id: 'Music Festival', caption: 'Music Festival' },
        { url: 'images/event2.jpg', public_id: 'Wedding Reception', caption: 'Wedding Reception' },
    ];

    const loadGallery = async () => {
        if (!galleryEl) return;
        try {
            const res = await fetch('/api/list-gallery');
            if (!res.ok) throw new Error('Gallery fetch failed');
            const data = await res.json();
            if (Array.isArray(data.images) && data.images.length) {
                renderGallery(data.images);
                if (galleryStatusEl) galleryStatusEl.textContent = 'Latest uploads';
                return;
            }
            renderGallery(fallbackImages);
            if (galleryStatusEl) galleryStatusEl.textContent = 'No uploads yet — showing samples';
        } catch (err) {
            renderGallery(fallbackImages);
            if (galleryStatusEl) galleryStatusEl.textContent = '';
        }
    };

    loadGallery();
});

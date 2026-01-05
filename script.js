document.addEventListener('DOMContentLoaded', () => {
    const galleryEl = document.getElementById('gallery');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');

    let currentIndex = 0;
    let allImages = [];

    const renderGallery = images => {
        if (!galleryEl) return;
        galleryEl.innerHTML = '';
        allImages = images;
        currentIndex = 0;

        images.forEach((img, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-item' + (index === 0 ? ' active' : '');

            const image = document.createElement('img');
            image.src = img.url;
            image.alt = img.alt || img.public_id || 'Event photo';

            const caption = document.createElement('p');
            caption.textContent = img.caption || img.public_id?.split('/').pop() || 'Event';

            card.appendChild(image);
            card.appendChild(caption);
            galleryEl.appendChild(card);
        });

        renderDots();
    };

    const renderDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        allImages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (index === currentIndex ? ' active' : '');
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        });
    };

    const showSlide = index => {
        if (!galleryEl) return;
        const items = galleryEl.querySelectorAll('.gallery-item');
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
        currentIndex = index;
        renderDots();
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % allImages.length;
        showSlide(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        showSlide(prevIndex);
    };

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

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
                return;
            }
            renderGallery(fallbackImages);
        } catch (err) {
            renderGallery(fallbackImages);
        }
    };

    loadGallery();
});

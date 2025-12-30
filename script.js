document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('#navMenu a[href^="#"]');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            const target = targetId ? document.querySelector(targetId) : null;
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                if (navMenu) {
                    navMenu.classList.remove('open');
                }
                if (navToggle) {
                    navToggle.classList.remove('open');
                }
            }
        });
    });

    const sections = document.querySelectorAll('section[id], header.hero[id]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            if (entry.isIntersecting && id) {
                navLinks.forEach(link => {
                    const linkTarget = link.getAttribute('href');
                    if (linkTarget === `#${id}`) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(section => observer.observe(section));

    const services = document.querySelectorAll('.services-list li[data-img]');
    const popup = document.getElementById('serviceImagePopup');
    const popupImg = document.getElementById('popupImg');

    if (services.length && popup && popupImg) {
        const hidePopup = () => {
            popup.style.display = 'none';
        };

        services.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const imgSrc = item.getAttribute('data-img');
                popupImg.src = imgSrc || '';
                popup.style.display = 'block';
                popup.style.top = `${item.offsetTop - 10}px`;
                popup.style.left = `${item.offsetLeft + item.offsetWidth + 24}px`;
            });
            item.addEventListener('mouseleave', hidePopup);
        });
    }

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

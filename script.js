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
});

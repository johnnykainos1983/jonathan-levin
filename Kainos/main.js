// Kainos Zero-G Interface Logic

document.addEventListener('DOMContentLoaded', () => {

    // Intersection Observer for the smooth slide-in fade effects
    const fadeUpElements = document.querySelectorAll('.fade-up');

    const ioOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once faded in
                // observer.unobserve(entry.target);
            }
        });
    }, ioOptions);

    fadeUpElements.forEach(el => {
        elementObserver.observe(el);
    });

    // Subtle Parallax effect on mousemove for the hero abstract crown
    const heroLayer = document.querySelector('.hero-section');
    const crown = document.querySelector('.abstract-crown');

    if (heroLayer && crown) {
        heroLayer.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px movement
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            crown.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Reset on mouse leave
        heroLayer.addEventListener('mouseleave', () => {
            crown.style.transform = `translate(0px, 0px)`;
            crown.style.transition = `transform 0.5s ease`;
        });

        heroLayer.addEventListener('mouseenter', () => {
            crown.style.transition = `none`;
        });
    }

});

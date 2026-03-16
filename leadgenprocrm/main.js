/* ═══════════════════════════════════════════════════════════ */
/* LeadGenPro CRM: Zero-G Interactivity Engine                */
/* ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. Sticky Navbar with Scroll Detection ─── */
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ─── 2. Mobile Hamburger Menu ─── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ─── 3. Smooth Scroll for Anchor Links ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ─── 4. Intersection Observer — Reveal on Scroll ─── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-element').forEach(el => {
        revealObserver.observe(el);
    });

    /* ─── 5. Animated Number Counter ─── */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    counter.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                requestAnimationFrame(animate);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
        counterObserver.observe(counter);
    });

    /* ─── 6. Mouse Parallax for Orbs ─── */
    let mouseX = 0, mouseY = 0;
    let orbX = 0, orbY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const orbs = document.querySelectorAll('.orb');
    const animateOrbs = () => {
        orbX += (mouseX - orbX) * 0.05;
        orbY += (mouseY - orbY) * 0.05;

        orbs.forEach((orb, i) => {
            const factor = (i + 1) * 25;
            orb.style.transform = `translate(${orbX * factor}px, ${orbY * factor}px)`;
        });

        requestAnimationFrame(animateOrbs);
    };
    animateOrbs();

    /* ─── 7. Hero Image Hover Effect ─── */
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
        heroImg.addEventListener('mouseenter', () => {
            heroImg.style.filter = 'brightness(1.15) drop-shadow(0 0 40px rgba(0,210,255,0.4))';
            heroImg.style.transform = 'translateY(-20px) scale(1.02)';
        });
        heroImg.addEventListener('mouseleave', () => {
            heroImg.style.filter = '';
            heroImg.style.transform = '';
        });
    }

    /* ─── 8. Booking Calendar Modal ─── */
    const bookingModal = document.getElementById('booking-modal');
    const bookingClose = document.getElementById('booking-modal-close');
    const openBookingBtns = document.querySelectorAll('.open-booking');

    const openBooking = () => {
        if (bookingModal) {
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Close mobile menu if open
            if (hamburger && mobileMenu) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        }
    };

    const closeBooking = () => {
        if (bookingModal) {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    openBookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openBooking();
        });
    });

    if (bookingClose) {
        bookingClose.addEventListener('click', closeBooking);
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBooking();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeBooking();
    });

    /* ─── 9. FAQ Accordion ─── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle the clicked one
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ─── 10. CTA Button Pulse Effect ─── */
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        setInterval(() => {
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 1500);
        }, 4000);
    });

    /* ─── 11. Active Nav Link Highlighting on Scroll ─── */
    const sections = document.querySelectorAll('section[id]');
    const navInternalLinks = document.querySelectorAll('.nav-links a:not(.btn)');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navInternalLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ─── 12. Feature Cards — Tilt on Hover (desktop only) ─── */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ─── 13. Typing effect for hero badge (subtle) ─── */
    const heroBadge = document.querySelector('.hero-badge span:last-child');
    if (heroBadge) {
        const originalText = heroBadge.textContent;
        heroBadge.textContent = '';

        let index = 0;
        const typeInterval = setInterval(() => {
            heroBadge.textContent += originalText[index];
            index++;
            if (index >= originalText.length) {
                clearInterval(typeInterval);
            }
        }, 40);
    }

});

/* ─── Add nav-active style dynamically ─── */
const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
    .nav-active {
        color: var(--accent-electric) !important;
    }
    .nav-active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(dynamicStyle);

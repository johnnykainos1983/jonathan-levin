// Zero-G UX Interactivity and UI behaviors

document.addEventListener('DOMContentLoaded', () => {

    // Intersection Observer for scroll animations (reveal-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(element => {
        revealObserver.observe(element);
    });

    // Pricing Billing Toggle
    const billingToggle = document.getElementById('billing-toggle-input');
    const amounts = document.querySelectorAll('.amount');

    if (billingToggle) {
        billingToggle.addEventListener('change', (e) => {
            const isAnnual = e.target.checked;

            amounts.forEach(amountEl => {
                // simple fade out/in effect for weightless feel
                amountEl.style.opacity = '0';
                amountEl.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    if (isAnnual) {
                        amountEl.textContent = amountEl.getAttribute('data-annual');
                    } else {
                        amountEl.textContent = amountEl.getAttribute('data-monthly');
                    }
                    amountEl.style.opacity = '1';
                    amountEl.style.transform = 'translateY(0)';
                }, 200);
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});

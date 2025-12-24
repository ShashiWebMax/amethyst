document.addEventListener('DOMContentLoaded', () => {
    // Simple scroll behavior for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Only scroll if target is on the current page
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                // If distinct page navigation is needed, logic can be added here
                // For now, assume mainly staying on page or navigating to root
                if (window.location.pathname !== '/' && targetId.startsWith('#')) {
                    window.location.href = '/' + targetId;
                }
            }
        });
    });

    // Sticky nav transition
    window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-md');
            } else {
                nav.classList.remove('shadow-md');
            }
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');
            const statusMsg = document.getElementById('form-status');

            // Loading State
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            btnText.textContent = 'Sending...';
            statusMsg.classList.add('hidden');

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                // const url = 'https://ai.skillhub.lk/webhook-test/a65859f2-7bfe-422e-a63a-1a0fdd60959b';
                const url = 'https://ai.skillhub.lk/webhook/a65859f2-7bfe-422e-a63a-1a0fdd60959b'
                // Sending data to configured webhook endpoint
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    statusMsg.textContent = 'Message sent successfully! We will contact you soon.';
                    statusMsg.className = 'text-center text-sm font-medium mt-4 text-green-600 block';
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }

            } catch (error) {
                console.error('Error:', error);
                statusMsg.textContent = 'Failed to send message. Please try again later or email us directly at info@amethyst.lk';
                statusMsg.className = 'text-center text-sm font-medium mt-4 text-red-600 block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Send Message';
            }
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (mobileMenuBtn && mobileMenu) {
        // Open mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            // document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });

        // Close mobile menu
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }

        // Close menu when clicking on navigation links (for same-page anchors)
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside (on the dark overlay)
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }
});

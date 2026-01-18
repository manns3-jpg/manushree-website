window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const flyLogo = document.querySelector('.fly-logo');
    const navLogo = document.querySelector('.navbar .logo-ca-icon');

    // 1. Check if animation already played this session
    const hasAnimationPlayed = sessionStorage.getItem('intro_played');

    if (hasAnimationPlayed && preloader) {
        preloader.style.display = 'none';
        document.body.classList.add('loaded');
        if (navLogo) navLogo.classList.add('visible');
        return;
    }

    if (preloader && flyLogo && navLogo) {
        // Use requestAnimationFrame to ensure layout is ready
        requestAnimationFrame(() => {
            // 2. Get positions
            const navRect = navLogo.getBoundingClientRect();
            const flyRect = flyLogo.getBoundingClientRect();

            // 3. Calculate transition
            const deltaX = navRect.left + (navRect.width / 2) - (flyRect.left + (flyRect.width / 2));
            const deltaY = navRect.top + (navRect.height / 2) - (flyRect.top + (flyRect.height / 2));
            const scale = navRect.width / flyRect.width;

            // 4. Trigger Animation after a short pause
            setTimeout(() => {
                flyLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

                // 5. Fade out preloader background early
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    document.body.classList.add('loaded');
                }, 600);

                // 6. Swap logos and cleanup
                setTimeout(() => {
                    navLogo.classList.add('visible');
                    flyLogo.style.opacity = '0';
                    sessionStorage.setItem('intro_played', 'true');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }, 1000);
            }, 800);
        });
    } else {
        // No preloader (sub-pages) or fallback
        if (preloader) preloader.style.display = 'none';
        document.body.classList.add('loaded');
        if (navLogo) navLogo.classList.add('visible');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll-Reveal Animation Logic
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 2. Form Handling Logic
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;

            // Show loading state
            submitBtn.innerText = 'SENDING...';
            submitBtn.disabled = true;

            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');

            const name = nameInput ? nameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const message = messageInput ? messageInput.value : '';

            const formData = {
                name,
                email,
                message,
                timestamp: new Date().toLocaleString()
            };

            try {
                // Send to FormSubmit via AJAX
                const response = await fetch("https://formsubmit.co/ajax/camanan1942@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: "New Website Inquiry from " + name
                    })
                });

                if (response.ok) {
                    // Capture data to localStorage as backup
                    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
                    submissions.push(formData);
                    localStorage.setItem('contact_submissions', JSON.stringify(submissions));

                    // Success feedback
                    submitBtn.innerText = 'SUCCESSFULLY SENT!';
                    submitBtn.style.background = '#27ae60';
                    contactForm.reset();
                    console.log('Form Submission Successful:', formData);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                submitBtn.innerText = 'FAILED TO SEND';
                submitBtn.style.background = '#e74c3c';
            } finally {
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                }, 5000);
            }
        });
    }

    // 3. Mobile Menu Logic
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    // Create Hamburger Button
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    navbar.insertBefore(hamburger, navLinks);

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    // 4. Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 4000; // Reduced to 4 seconds for better experience

    if (slides.length > 0) {
        function showSlide(n) {
            slides.forEach(slide => {
                slide.classList.remove('active');
                const content = slide.querySelector('.content');
                if (content) content.classList.remove('active');
            });
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            // Explicitly trigger reveal classes inside the slide
            const activeContent = slides[currentSlide].querySelector('.content');
            if (activeContent) {
                setTimeout(() => activeContent.classList.add('active'), 100);
            }
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // Initialize first slide properly
        showSlide(0);

        // Auto-play
        let sliderTimer = setInterval(nextSlide, slideInterval);

        // Click dots to change slides
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(sliderTimer);
                showSlide(index);
                sliderTimer = setInterval(nextSlide, slideInterval);
            });
        });

        // Pause on hover
        const sliderContainer = document.querySelector('.hero-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(sliderTimer));
            sliderContainer.addEventListener('mouseleave', () => {
                clearInterval(sliderTimer);
                sliderTimer = setInterval(nextSlide, slideInterval);
            });
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. Animated Particle Network Background (Canvas)
       ========================================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        function initCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            particles = [];

            // Adjust particle count based on screen size for performance
            let particleCount = width < 768 ? 40 : 80;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            // Detect theme to adjust particle color
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const particleColor = isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.2)';
            const lineColor = isDark ? 'rgba(244, 114, 182, 0.15)' : 'rgba(244, 114, 182, 0.1)';

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw point
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                // Connect with lines
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1 - (dist / 150);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawParticles);
        }

        initCanvas();
        drawParticles();
        window.addEventListener('resize', initCanvas);
    }

    /* ==========================================================
       2. Advanced Cinematic Custom Cursor & Magnetic Effect
       ========================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let isTouchDevice = false;

    // Detect touch to disable custom cursor
    window.addEventListener('touchstart', function () {
        isTouchDevice = true;
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }, { once: true });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        if (isTouchDevice) return;
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Without magnetic effect, outline follows normally
        if (!document.querySelector('.magnetic-item:hover')) {
            cursorOutline.style.left = `${mouseX}px`;
            cursorOutline.style.top = `${mouseY}px`;
            cursorOutline.style.transform = `translate(-50%, -50%) scale(1)`;
        }
    });

    // Magnetic logic
    const magneticItems = document.querySelectorAll('.magnetic-item, a, button, input, textarea');

    magneticItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (isTouchDevice) return;
            cursorOutline.classList.add('hover-scale');
        });

        item.addEventListener('mousemove', (e) => {
            if (isTouchDevice) return;
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const itemCenterY = rect.top + rect.height / 2;

            // Magnet pull strength
            const pullX = (mouseX - itemCenterX) * 0.2;
            const pullY = (mouseY - itemCenterY) * 0.2;

            // Move item slightly towards cursor
            if (item.classList.contains('magnetic-item')) {
                item.style.transform = `translate(${pullX}px, ${pullY}px)`;
            }

            // Snap outline to center of the button/link
            cursorOutline.style.left = `${itemCenterX}px`;
            cursorOutline.style.top = `${itemCenterY}px`;
            // Scale outline based on item width
            cursorOutline.style.transform = `translate(-50%, -50%) scale(${rect.width / 30})`;
            cursorOutline.style.borderRadius = getComputedStyle(item).borderRadius || '50%';
        });

        item.addEventListener('mouseleave', () => {
            if (isTouchDevice) return;
            cursorOutline.classList.remove('hover-scale');
            if (item.classList.contains('magnetic-item')) {
                item.style.transform = `translate(0px, 0px)`;
            }
            cursorOutline.style.borderRadius = '50%';
        });
    });

    /* ==========================================================
       3. Smooth 3D Hover Effects (Tilt)
       ========================================================== */
    const tiltElements = document.querySelectorAll('.tilt-element');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (isTouchDevice) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (-10 to 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            if (isTouchDevice) return;
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    /* ==========================================================
       4. Intersection Observer: Cinematic Scroll & Counters
       ========================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const cinematicObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled');

                // Trigger counter animation if it has .counter
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;

                        // Increment speed logic
                        const speed = 40;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 40);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => cinematicObserver.observe(el));

    /* ==========================================================
       5. Header & Active Styles scroll mapping
       ========================================================== */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Glassmorphism shadow toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================
       6. Mobile Menu
       ========================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================
       7. Generate PDF Integration
       ========================================================== */
    const allPdfBtns = document.querySelectorAll('.pdf-download');

    allPdfBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            btn.style.opacity = '0.8';

            const opt = {
                margin: [15, 15, 15, 15],
                filename: 'Portafolio_Tech_Adriana_Gualdron.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            };

            const element = document.getElementById('portfolio-content');

            const style = document.createElement('style');
            style.id = 'pdf-styles';
            // Disable animations, hide interactive UI, linearize timeline for print
            style.innerHTML = `
                .section { padding: 40px 0 !important; page-break-inside: avoid; background: white !important; color: black !important; }
                .first-section { min-height: auto !important; padding-top: 40px !important; }
                .hero-container { flex-direction: column !important; text-align: center; gap: 20px !important; }
                .no-print { display: none !important; }
                .timeline-container { display: none !important; }
                .pdf-only-timeline { display: block !important; margin-top:30px; }
                .pdf-only-timeline ul { list-style: circle inside; text-align: left; padding: 20px; }
                .animate-on-scroll { opacity: 1 !important; transform: none !important; transition: none !important; }
                * { animation: none !important; transition: none !important; cursor: auto !important; }
                .card, .3d-card { transform: none !important; box-shadow: none !important; border: 1px solid #ddd !important; background: white !important;}
                
                .skills-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 15px !important; }
                .projects-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 15px !important; }
                .stats-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 10px !important;}
                
                .project-img { height: 150px !important; }
                body { background: white !important; color: black !important;}
                h1, h2, h3, h4, p, span { color: black !important; -webkit-text-fill-color: black !important; }
            `;
            document.head.appendChild(style);

            // Hide decorative canvas explicitly just inside element scope although global hide exists
            const canvas = document.getElementById('bg-canvas');
            if (canvas) canvas.style.display = 'none';

            setTimeout(() => {
                window.scrollTo(0, 0);
                html2pdf().set(opt).from(element).save().then(() => {
                    document.getElementById('pdf-styles').remove();
                    if (canvas) canvas.style.display = 'block';
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                });
            }, 600);
        });
    });
});

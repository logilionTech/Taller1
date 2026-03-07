document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    // 2. Active Menu Link Updates on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Generar PDF
    const downloadPdfBtn = document.getElementById('download-pdf');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            // Options for html2pdf
            const opt = {
                margin:       [15, 15, 15, 15],
                filename:     'Portafolio_Adriana_Gualdron.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: ['css', 'legacy'] }
            };

            const element = document.getElementById('portfolio-content');
            
            // Temporary styles to adjust layout for PDF
            const style = document.createElement('style');
            style.id = 'pdf-styles';
            style.innerHTML = `
                /* Enable forced page breaks for printing where needed */
                .section { padding: 20px 0 !important; page-break-inside: avoid; }
                .first-section { min-height: auto !important; padding-top: 20px !important; }
                .hero-container { flex-direction: column !important; text-align: center; }
                .no-print { display: none !important; }
                
                /* Adjust grids */
                .skills-grid {
                    display: grid !important;
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 15px !important;
                }
                .projects-grid {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 15px !important;
                }
                .contact-wrapper {
                    flex-direction: column !important;
                }
                
                /* Reset properties that might cause blank pages or weird rendering */
                .animate-on-scroll { opacity: 1 !important; transform: none !important; transition: none !important; }
                * { animation: none !important; transition: none !important; }
            `;
            document.head.appendChild(style);

            // Hide some elements like decorators out of flow to prevent formatting issues
            const decorators = document.querySelectorAll('.decorator');
            decorators.forEach(d => d.style.display = 'none');

            // Wait a bit and generate to ensure styles apply
            setTimeout(() => {
                // Ensure page jumps to top to avoid canvas cutoffs
                window.scrollTo(0,0);
                
                html2pdf().set(opt).from(element).save().then(() => {
                    // Restore after generation
                    document.getElementById('pdf-styles').remove();
                    decorators.forEach(d => d.style.display = 'block');
                });
            }, 300);
        });
    }
});

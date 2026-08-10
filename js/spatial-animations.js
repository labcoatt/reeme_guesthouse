/**
 * Reeme Guest House — Spatial Animations & Interactive Engine
 * Powered by GSAP 3.12, ScrollTrigger, and Lenis Smooth Scroll
 * Inspired by Norvak Spatial Living architectural design language.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll Engine
    let lenis = null;
    if (typeof Lenis !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothTouch: false,
            touchMultiplier: 1.5,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Synchronize GSAP ScrollTrigger with Lenis
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // Register GSAP Plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 2. Spatial Custom Fluid Cursor & Trailing Follower Ring
        initSpatialCursor();

        // 3. GSAP ScrollTrigger Text & Element Reveal Animations
        initScrollReveals();

        // 4. Parallax Image & Spatial Scale Effects
        initParallaxImages();

        // 5. Live Metric Animated Counters
        initMetricCounters();

        // 6. Magnetic Button Interactive Physics
        initMagneticButtons();

        // 7. Scroll-Directed Smart Floating Header Morph
        initSmartHeader();
    }
});

/* ==========================================================================
   2. SPATIAL FLUID CURSOR SYSTEM
   ========================================================================== */
function initSpatialCursor() {
    if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) return;

    // Inject cursor elements into body if not already present
    let cursor = document.querySelector('.spatial-cursor');
    let follower = document.querySelector('.spatial-cursor-follower');

    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'spatial-cursor fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-0';
        document.body.appendChild(cursor);
    }

    if (!follower) {
        follower = document.createElement('div');
        follower.className = 'spatial-cursor-follower fixed top-0 left-0 w-10 h-10 border border-primary/40 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[9px] font-bold tracking-widest text-primary uppercase transition-opacity duration-300 opacity-0 backdrop-blur-[2px] bg-primary/5';
        document.body.appendChild(follower);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
        }

        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0.1,
            ease: 'power2.out'
        });

        gsap.to(follower, {
            x: mouseX,
            y: mouseY,
            duration: 0.35,
            ease: 'power2.out'
        });
    });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
    });

    // Hover triggers for interactive elements
    const hoverElements = document.querySelectorAll('a, button, [data-spatial-hover], .neomorph-raised, .neomorph-inset');
    hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            const label = el.getAttribute('data-spatial-label') || '';
            follower.textContent = label;
            
            gsap.to(follower, {
                scale: label ? 2.2 : 1.5,
                backgroundColor: 'rgba(167, 107, 70, 0.15)',
                borderColor: 'rgba(167, 107, 70, 0.8)',
                duration: 0.3
            });
            gsap.to(cursor, { scale: 0.5, backgroundColor: '#C5A059', duration: 0.3 });
        });

        el.addEventListener('mouseleave', () => {
            follower.textContent = '';
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'rgba(167, 107, 70, 0.05)',
                borderColor: 'rgba(167, 107, 70, 0.4)',
                duration: 0.3
            });
            gsap.to(cursor, { scale: 1, backgroundColor: '#A76B46', duration: 0.3 });
        });
    });
}

/* ==========================================================================
   3. GSAP SCROLLTRIGGER REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveals() {
    // Headings Reveal with clip mask and smooth rise
    const headings = document.querySelectorAll('[data-spatial-heading]');
    headings.forEach((heading) => {
        gsap.fromTo(heading, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Generic Staggered Card & Container Reveals
    const containers = document.querySelectorAll('[data-spatial-stagger]');
    containers.forEach((container) => {
        const children = container.children;
        gsap.fromTo(children, 
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Individual Fade-Up Elements
    const fadeElements = document.querySelectorAll('[data-spatial-fade]');
    fadeElements.forEach((el) => {
        const delay = parseFloat(el.getAttribute('data-spatial-delay')) || 0;
        gsap.fromTo(el, 
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.85,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

/* ==========================================================================
   4. PARALLAX IMAGE & SPATIAL SCALE EFFECTS
   ========================================================================== */
function initParallaxImages() {
    const parallaxImgs = document.querySelectorAll('[data-spatial-parallax]');
    parallaxImgs.forEach((img) => {
        gsap.fromTo(img, 
            { scale: 1.18, y: '-6%' },
            {
                scale: 1.0,
                y: '0%',
                ease: 'none',
                scrollTrigger: {
                    trigger: img.parentElement || img,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2
                }
            }
        );
    });
}

/* ==========================================================================
   5. LIVE METRIC ANIMATED COUNTERS
   ========================================================================== */
function initMetricCounters() {
    const counters = document.querySelectorAll('[data-spatial-counter]');
    counters.forEach((counter) => {
        const targetVal = parseFloat(counter.getAttribute('data-spatial-counter')) || 0;
        const suffix = counter.getAttribute('data-spatial-suffix') || '';
        const prefix = counter.getAttribute('data-spatial-prefix') || '';
        const decimals = parseInt(counter.getAttribute('data-spatial-decimals'), 10) || 0;

        const obj = { val: 0 };
        gsap.to(obj, {
            val: targetVal,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                toggleActions: 'play none none reset'
            },
            onUpdate: () => {
                counter.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            }
        });
    });
}

/* ==========================================================================
   6. MAGNETIC BUTTON INTERACTIVE PHYSICS
   ========================================================================== */
function initMagneticButtons() {
    if (window.innerWidth < 768) return;

    const magneticBtns = document.querySelectorAll('[data-spatial-magnetic], .interactive-hover-btn, header a[href="contact.html"]');
    magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: relX * 0.35,
                y: relY * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });
}

/* ==========================================================================
   7. SMART MORPHING FLOATING HEADER
   ========================================================================== */
function initSmartHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
            const currentScrollY = self.scroll();

            if (currentScrollY > 100) {
                header.classList.add('shadow-md', 'bg-[#F5F2EB]/95', 'backdrop-blur-md');
                
                // Direction-aware hide/reveal
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    // Scrolling Down -> Hide slightly
                    gsap.to(header, { y: '-100%', duration: 0.35, ease: 'power2.inOut' });
                } else {
                    // Scrolling Up -> Show
                    gsap.to(header, { y: '0%', duration: 0.35, ease: 'power2.out' });
                }
            } else {
                gsap.to(header, { y: '0%', duration: 0.35, ease: 'power2.out' });
                header.classList.remove('shadow-md');
            }

            lastScrollY = currentScrollY;
        }
    });
}

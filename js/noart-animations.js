/**
 * Reeme Guest House — No Art Music Inspired Animations Engine
 * Features: Lenis Smooth Scroll, Infinite Draggable Image Marquee, 
 * Text Scramble Reveal, Technical Corner Marker Hover Effects & Live Stat Counters.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    let lenis = null;
    if (typeof Lenis !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smoothTouch: false,
            touchMultiplier: 1.5
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // Register GSAP Plugins
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
        if (typeof Observer !== 'undefined') gsap.registerPlugin(Observer);

        // 2. Initialize Draggable Infinite Marquee Ribbon
        initDraggableMarquee();

        // 3. Initialize Text Scramble / Decoder Reveal
        initTextScrambleReveal();

        // 4. Initialize Live Metric Counters
        initMetricCounters();
    }
});

/* ==========================================================================
   2. INFINITE DRAGGABLE MARQUEE RIBBON (NO ART MUSIC ENGINE)
   ========================================================================== */
function initDraggableMarquee() {
    const wrappers = document.querySelectorAll('[data-draggable-marquee-init]');
    if (!wrappers.length) return;

    const getNumberAttr = (el, name, fallback) => {
        const value = parseFloat(el.getAttribute(name));
        return Number.isFinite(value) ? value : fallback;
    };

    wrappers.forEach((wrapper) => {
        if (wrapper.getAttribute('data-draggable-marquee-init') === 'initialized') return;

        const collection = wrapper.querySelector('[data-draggable-marquee-collection]');
        const list = wrapper.querySelector('[data-draggable-marquee-list]');
        if (!collection || !list) return;

        const duration = getNumberAttr(wrapper, 'data-duration', 25);
        const multiplier = getNumberAttr(wrapper, 'data-multiplier', 35);
        const sensitivity = getNumberAttr(wrapper, 'data-sensitivity', 0.01);

        const wrapperWidth = wrapper.getBoundingClientRect().width;
        const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
        if (!wrapperWidth || !listWidth) return;

        // Clone list items to ensure infinite loop coverage
        const minRequiredWidth = wrapperWidth + listWidth * 2;
        while (collection.scrollWidth < minRequiredWidth) {
            const clone = list.cloneNode(true);
            clone.setAttribute('data-draggable-marquee-clone', '');
            clone.setAttribute('aria-hidden', 'true');
            collection.appendChild(clone);
        }

        const wrapX = gsap.utils.wrap(-listWidth, 0);
        gsap.set(collection, { x: 0 });

        const marqueeLoop = gsap.to(collection, {
            x: -listWidth,
            duration: duration,
            ease: 'none',
            repeat: -1,
            onReverseComplete: () => marqueeLoop.progress(1),
            modifiers: {
                x: (x) => wrapX(parseFloat(x)) + 'px'
            }
        });

        const timeScale = { value: 1 };
        function applyTimeScale() {
            marqueeLoop.timeScale(timeScale.value);
        }

        // Observer for drag & swipe velocity inertia
        if (typeof Observer !== 'undefined') {
            Observer.create({
                target: wrapper,
                type: 'pointer,touch',
                preventDefault: false,
                onChangeX: (e) => {
                    let velocityTimeScale = e.velocityX * -sensitivity;
                    velocityTimeScale = gsap.utils.clamp(-multiplier, multiplier, velocityTimeScale);

                    gsap.killTweensOf(timeScale);
                    const restingDirection = velocityTimeScale < 0 ? -1 : 1;

                    gsap.timeline({ onUpdate: applyTimeScale })
                        .to(timeScale, { value: velocityTimeScale, duration: 0.1, overwrite: true })
                        .to(timeScale, { value: restingDirection, duration: 1.2 });
                }
            });
        }

        // Pause marquee when out of viewport
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: wrapper,
                start: 'top bottom',
                end: 'bottom top',
                onEnter: () => marqueeLoop.resume(),
                onLeave: () => marqueeLoop.pause(),
                onEnterBack: () => marqueeLoop.resume(),
                onLeaveBack: () => marqueeLoop.pause()
            });
        }

        wrapper.setAttribute('data-draggable-marquee-init', 'initialized');
    });
}

/* ==========================================================================
   3. TEXT SCRAMBLE / DECODER REVEAL ANIMATION
   ========================================================================== */
function initTextScrambleReveal() {
    const scrambleEls = document.querySelectorAll('[data-scramble-reveal]');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*@';

    scrambleEls.forEach((el) => {
        const originalText = el.textContent.trim();
        let isAnimated = false;

        function animateText() {
            if (isAnimated) return;
            isAnimated = true;

            let iteration = 0;
            const totalSteps = originalText.length * 2;

            const interval = setInterval(() => {
                el.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (char === ' ' || char === '\n') return char;
                        if (index < iteration / 2) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= totalSteps) {
                    clearInterval(interval);
                    el.textContent = originalText;
                }
                iteration += 1;
            }, 30);
        }

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: animateText
            });
        } else {
            animateText();
        }
    });
}

/* ==========================================================================
   4. LIVE METRIC ANIMATED COUNTERS
   ========================================================================== */
function initMetricCounters() {
    const counters = document.querySelectorAll('[data-stat-counter]');
    counters.forEach((counter) => {
        const targetVal = parseFloat(counter.getAttribute('data-stat-counter')) || 0;
        const suffix = counter.getAttribute('data-stat-suffix') || '';
        const prefix = counter.getAttribute('data-stat-prefix') || '';

        const obj = { val: 0 };

        if (typeof ScrollTrigger !== 'undefined') {
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
                    counter.textContent = prefix + Math.floor(obj.val) + suffix;
                }
            });
        } else {
            counter.textContent = prefix + targetVal + suffix;
        }
    });
}

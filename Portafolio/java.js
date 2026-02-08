document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('DOMContentLoaded', () => {
    // Prepare reveal-on-scroll elements
    const selectors = ['.card', '.project-card', '.video-card', '.stat', '.hero-text', '.hero-image'];
    const elems = Array.from(document.querySelectorAll(selectors.join(',')));
    elems.forEach(el => el.classList.add('reveal-hidden'));

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                entry.target.classList.remove('reveal-hidden');
                // unobserve to avoid repeated callbacks
                obs.unobserve(entry.target);
            }
        });
    }, {root: null, threshold: 0.12});

    elems.forEach(el => obs.observe(el));
    
    // Enhance keyboard focus for skip-to content behavior
    const navLinks = document.querySelectorAll('.nav a, .footer-nav a');
    navLinks.forEach(a => a.addEventListener('click', (e) => {
        // allow default anchor behavior, but set focus to target for accessibility
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) setTimeout(() => target.setAttribute('tabindex','-1') || target.focus(), 300);
        }
    }));

    // Marquee: pause on pointer enter for better control
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(m => {
        m.addEventListener('pointerenter', () => m.classList.add('paused'));
        m.addEventListener('pointerleave', () => m.classList.remove('paused'));
        // touch support: toggle pause briefly on touch
        m.addEventListener('touchstart', () => m.classList.add('paused'));
        m.addEventListener('touchend', () => setTimeout(() => m.classList.remove('paused'), 400));
    });

    // Improved marquee using measured widths and Web Animations API
    // This avoids visible resets by animating exactly one group's width.
    const marqueeTracks = document.querySelectorAll('.marquee-track');
    marqueeTracks.forEach(track => {
        const group = track.querySelector('.marquee-group');
        if (!group) return;
        // measure width (including gaps)
        const width = group.getBoundingClientRect().width;
        // if width is zero, skip (images/fonts may still be loading)
        if (width <= 0) return;

        // Disable any CSS animation on this track to avoid conflicting animations
        track.style.animation = 'none';

        // Create a continuous animation translating by one group width.
        // Make it a bit faster by increasing pixels-per-second (here ~80px/s) and minimum 5s.
        const duration = Math.max(5000, Math.round((width / 80) * 1000));
        const animation = track.animate(
            [ { transform: 'translateX(0)' }, { transform: `translateX(-${width}px)` } ],
            { duration: duration, iterations: Infinity, easing: 'linear', direction: track.classList.contains('marquee-track--rl') ? 'reverse' : 'normal' }
        );

        // store animation so we can pause/resume from container events
        track._marqueeAnimation = animation;
    });

    // Hook pause/resume to container pointer/touch events (keeps earlier behavior)
    marquees.forEach(m => {
        m.addEventListener('pointerenter', () => {
            m.querySelectorAll('.marquee-track').forEach(t => t._marqueeAnimation && t._marqueeAnimation.pause());
        });
        m.addEventListener('pointerleave', () => {
            m.querySelectorAll('.marquee-track').forEach(t => t._marqueeAnimation && t._marqueeAnimation.play());
        });
        m.addEventListener('touchstart', () => {
            m.querySelectorAll('.marquee-track').forEach(t => t._marqueeAnimation && t._marqueeAnimation.pause());
        });
        m.addEventListener('touchend', () => {
            setTimeout(() => m.querySelectorAll('.marquee-track').forEach(t => t._marqueeAnimation && t._marqueeAnimation.play()), 400);
        });
    });

    // FAQ toggles: expand/collapse answers
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            const answer = btn.nextElementSibling;
            btn.setAttribute('aria-expanded', String(!expanded));
            if (!expanded) {
                btn.querySelector('.faq-icon').textContent = '−';
                answer.hidden = false;
            } else {
                btn.querySelector('.faq-icon').textContent = '﹢';
                answer.hidden = true;
            }
        });
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!menuToggle || !mobileNav) return;

    const setMenu = (open) => {
        mobileNav.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        mobileNav.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => {
        setMenu(!mobileNav.classList.contains('open'));
    });

    mobileNav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        setMenu(false);
    });
});


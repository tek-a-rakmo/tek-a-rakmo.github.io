/* ============================================================
   main.js -- Smooth scroll, nav, custom cursor, progress bar.
   Loaded last; orchestrates the shell around the content.
   ============================================================ */
(function () {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ---------- Lenis smooth scroll (synced with GSAP) ---------- */
    function initLenis() {
        if (prefersReduced || typeof Lenis === 'undefined') return;
        var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
        window.lenisInstance = lenis;

        if (typeof gsap !== 'undefined' && gsap.ticker) {
            lenis.on('scroll', function () { if (window.ScrollTrigger) ScrollTrigger.update(); });
            gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        }
    }

    /* ---------- Anchor scrolling ---------- */
    function initAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = a.getAttribute('href');
                if (id === '#' || id.length < 2) return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                closeMobileMenu();
                if (window.lenisInstance) {
                    window.lenisInstance.scrollTo(target, { offset: -10 });
                } else {
                    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
                }
            });
        });
    }

    /* ---------- Nav state + scroll-spy ---------- */
    function initNav() {
        var nav = document.getElementById('nav');
        var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
        var sections = links
            .map(function (l) { return document.querySelector(l.getAttribute('href')); })
            .filter(Boolean);

        function onScroll() {
            if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
            updateProgress();

            var pos = window.scrollY + window.innerHeight * 0.35;
            var currentId = null;
            sections.forEach(function (sec) {
                if (sec.offsetTop <= pos) currentId = sec.id;
            });
            links.forEach(function (l) {
                l.classList.toggle('is-active', l.getAttribute('href') === '#' + currentId);
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Scroll progress bar ---------- */
    var progressEl = document.getElementById('scroll-progress');
    function updateProgress() {
        if (!progressEl) return;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        progressEl.style.width = pct + '%';
    }

    /* ---------- Mobile menu ---------- */
    var mobileMenu = document.getElementById('mobile-menu');
    var navToggle = document.getElementById('nav-toggle');
    function closeMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (navToggle) { navToggle.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); }
    }
    function initMobileMenu() {
        if (!navToggle || !mobileMenu) return;
        navToggle.addEventListener('click', function () {
            var open = mobileMenu.classList.toggle('is-open');
            mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
            navToggle.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    /* ---------- Custom cursor + magnetic buttons ---------- */
    function initCursor() {
        if (!finePointer || prefersReduced) return;
        var dot = document.getElementById('cursor-dot');
        var ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;
        document.documentElement.classList.add('cursor-ready');

        var mx = window.innerWidth / 2, my = window.innerHeight / 2;
        var rx = mx, ry = my;

        window.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
        }, { passive: true });

        (function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll('[data-hover]').forEach(function (el) {
            el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
            el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
        });

        // Magnetic pull on tagged buttons.
        document.querySelectorAll('[data-magnetic]').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var x = e.clientX - (r.left + r.width / 2);
                var y = e.clientY - (r.top + r.height / 2);
                el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
            });
            el.addEventListener('mouseleave', function () { el.style.transform = ''; });
        });
    }

    function init() {
        initLenis();
        initAnchors();
        initNav();
        initMobileMenu();
        initCursor();
        updateProgress();
        window.addEventListener('resize', updateProgress);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

/* ============================================================
   animations.js -- GSAP ScrollTrigger choreography
   Every motion has narrative intent: signal emerges from noise,
   coordinates lock on, layers of skill draw in, numbers count up.
   ============================================================ */
(function () {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth < 768;

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    ready(function () {
        // Make sure project cards exist before we wire reveals to them.
        if (window.OrbitProjects && window.OrbitProjects.renderCards) {
            window.OrbitProjects.renderCards();
        }

        // Reduced motion: reveal everything instantly, build the radar statically.
        if (prefersReduced || typeof gsap === 'undefined') {
            document.querySelectorAll('[data-reveal], [data-fade]').forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            lockAllCoordinates();
            buildRadar();
            countAllStats();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        heroIntro();
        genericReveals();
        signalNoise();
        coordinateLockOn();
        buildRadar();
        radarHighlight();
        countStats();

        // Recalculate once everything (fonts, images) settles.
        window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    });

    /* ---------- Hero ---------- */
    function heroIntro() {
        var title = document.getElementById('hero-title');
        if (title) {
            var words = title.textContent.trim().split(/\s+/);
            title.innerHTML = words.map(function (w) {
                return '<span class="word"><span>' + w + '</span></span>';
            }).join(' ');
            gsap.set(title.querySelectorAll('.word > span'), { yPercent: 110 });
            gsap.set(title, { opacity: 1 });
        }

        var tl = gsap.timeline({ delay: 0.25 });
        var eyebrow = document.querySelector('.hero__eyebrow');
        if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        if (title) tl.to(title.querySelectorAll('.word > span'), { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.06 }, '-=0.3');
        tl.fromTo('.hero__subtitle', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
        tl.fromTo('.hero__actions', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');
    }

    /* ---------- Generic reveal-on-scroll ---------- */
    function genericReveals() {
        var els = gsap.utils.toArray('[data-reveal]');
        els.forEach(function (el) {
            gsap.fromTo(el, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
            });
        });
    }

    /* ---------- Signal: noise becomes order ---------- */
    function signalNoise() {
        var host = document.getElementById('signal-noise');
        if (!host || isMobile) return;

        var COUNT = 48;
        var cols = 8;
        var dots = [];
        for (var i = 0; i < COUNT; i++) {
            var dot = document.createElement('span');
            dot.style.cssText = 'position:absolute;width:3px;height:3px;border-radius:50%;background:rgba(16,185,129,0.5);';
            host.appendChild(dot);
            dots.push(dot);
        }
        host.style.cssText += 'position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0.5;';

        // Scattered start positions, ordered grid end positions.
        dots.forEach(function (dot, i) {
            var gx = (i % cols) / (cols - 1) * 100;
            var gy = Math.floor(i / cols) / (Math.ceil(COUNT / cols) - 1) * 100;
            gsap.set(dot, { left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', opacity: 0.2 });
            gsap.to(dot, {
                left: gx + '%', top: gy + '%', opacity: 0.6,
                ease: 'none',
                scrollTrigger: { trigger: '#signal', start: 'top bottom', end: 'center center', scrub: 1 }
            });
        });
    }

    /* ---------- Coordinates: typewriter lock-on ---------- */
    function coordinateLockOn() {
        document.querySelectorAll('.coord-node').forEach(function (node) {
            var geo = node.querySelector('.coord-node__geo');
            if (!geo) return;
            var full = geo.getAttribute('data-coord') || geo.textContent;
            geo.textContent = '';
            ScrollTrigger.create({
                trigger: node,
                start: 'top 78%',
                once: true,
                onEnter: function () { typeOut(geo, full, function () { node.classList.add('is-locked'); }); }
            });
        });
    }

    function typeOut(el, text, done) {
        var i = 0;
        (function step() {
            el.textContent = text.slice(0, i);
            i++;
            if (i <= text.length) setTimeout(step, 28);
            else if (done) done();
        })();
    }

    function lockAllCoordinates() {
        document.querySelectorAll('.coord-node').forEach(function (n) {
            var geo = n.querySelector('.coord-node__geo');
            if (geo) geo.textContent = geo.getAttribute('data-coord') || geo.textContent;
            n.classList.add('is-locked');
        });
    }

    /* ---------- Skills radar ---------- */
    var radarChart = null;
    function buildRadar() {
        if (typeof Chart === 'undefined') return;
        var canvas = document.getElementById('skills-radar');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'JetBrains Mono', monospace";

        radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Analysis', 'Programming', 'Software', 'Digital Agronomy'],
                datasets: [{
                    label: 'Capability',
                    data: [5, 4.3, 4.6, 4.2],
                    fill: true,
                    backgroundColor: 'rgba(16,185,129,0.18)',
                    borderColor: '#10b981',
                    pointBackgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#34d399'],
                    pointBorderColor: '#06060a',
                    pointRadius: 5,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        min: 0, max: 5,
                        ticks: { display: false, stepSize: 1 },
                        grid: { color: 'rgba(30,41,59,0.7)' },
                        angleLines: { color: 'rgba(30,41,59,0.7)' },
                        pointLabels: { color: '#e2e8f0', font: { size: 12, family: "'Space Grotesk', sans-serif" } }
                    }
                },
                animation: false
            }
        });

        if (!prefersReduced && typeof gsap !== 'undefined') {
            // Draw-in: animate the data values from 0 once in view.
            var target = [5, 4.3, 4.6, 4.2];
            var proxy = { v: 0 };
            ScrollTrigger.create({
                trigger: '.stack__radar',
                start: 'top 80%',
                once: true,
                onEnter: function () {
                    gsap.to(proxy, {
                        v: 1, duration: 1.4, ease: 'power3.out',
                        onUpdate: function () {
                            radarChart.data.datasets[0].data = target.map(function (t) { return t * proxy.v; });
                            radarChart.update('none');
                        }
                    });
                }
            });
        }
    }

    function radarHighlight() {
        document.querySelectorAll('.skill-card').forEach(function (card) {
            var axis = parseInt(card.getAttribute('data-axis'), 10);
            card.addEventListener('mouseenter', function () {
                if (!radarChart) return;
                var sizes = [5, 5, 5, 5];
                sizes[axis] = 10;
                radarChart.data.datasets[0].pointRadius = sizes;
                radarChart.update('none');
            });
            card.addEventListener('mouseleave', function () {
                if (!radarChart) return;
                radarChart.data.datasets[0].pointRadius = 5;
                radarChart.update('none');
            });
        });
    }

    /* ---------- Count-up stats ---------- */
    function countStats() {
        document.querySelectorAll('.stat__num').forEach(function (el) {
            var target = parseFloat(el.getAttribute('data-count')) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            var proxy = { v: 0 };
            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                once: true,
                onEnter: function () {
                    gsap.to(proxy, {
                        v: target, duration: 1.8, ease: 'power2.out',
                        onUpdate: function () { el.innerHTML = format(proxy.v) + suffix; },
                        onComplete: function () { el.innerHTML = format(target) + suffix; }
                    });
                }
            });
        });
    }

    function countAllStats() {
        document.querySelectorAll('.stat__num').forEach(function (el) {
            var target = parseFloat(el.getAttribute('data-count')) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            el.innerHTML = format(target) + suffix;
        });
    }

    function format(n) { return Math.round(n).toLocaleString('en-US'); }
})();

/* ============================================================
   particles.js -- Background constellation + rotating globe
   A sensor-network metaphor: drifting nodes connect into
   transient links, with a slowly rotating wireframe globe of
   projected points sitting behind the hero.
   Exposes window.OrbitParticles.stop() so other modules can
   disable it (reduced motion, etc.).
   ============================================================ */
(function () {
    'use strict';

    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = canvas.getContext('2d');

    var width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var driftNodes = [];
    var globePoints = [];
    var mouse = { x: 0, y: 0, active: false };
    var rafId = null;
    var running = false;
    var rotation = 0;

    var COLORS = { green: '16, 185, 129', blue: '59, 130, 246', amber: '245, 158, 11' };

    function isMobile() { return window.innerWidth < 768; }

    function nodeCount() {
        if (isMobile()) return 28;
        return Math.min(90, Math.floor(window.innerWidth / 16));
    }

    function resize() {
        width = canvas.clientWidth = window.innerWidth;
        height = canvas.clientHeight = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildScene();
    }

    function buildScene() {
        // Drifting constellation nodes
        driftNodes = [];
        var n = nodeCount();
        for (var i = 0; i < n; i++) {
            driftNodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.6 + 0.4
            });
        }

        // Globe wireframe points distributed on a sphere (Fibonacci sphere)
        globePoints = [];
        if (!isMobile()) {
            var count = 220;
            var offset = 2 / count;
            var increment = Math.PI * (3 - Math.sqrt(5));
            for (var k = 0; k < count; k++) {
                var y = k * offset - 1 + offset / 2;
                var rad = Math.sqrt(1 - y * y);
                var phi = k * increment;
                globePoints.push({
                    x: Math.cos(phi) * rad,
                    y: y,
                    z: Math.sin(phi) * rad
                });
            }
        }
    }

    function drawGlobe() {
        if (!globePoints.length) return;
        var cx = width * 0.72;
        var cy = height * 0.42;
        var radius = Math.min(width, height) * 0.26;
        var cosR = Math.cos(rotation), sinR = Math.sin(rotation);

        for (var i = 0; i < globePoints.length; i++) {
            var p = globePoints[i];
            // Rotate around Y axis
            var x = p.x * cosR - p.z * sinR;
            var z = p.x * sinR + p.z * cosR;
            var y = p.y;
            // Simple perspective
            var scale = 0.6 + (z + 1) * 0.4;
            var sx = cx + x * radius;
            var sy = cy + y * radius;
            var alpha = (z + 1) / 2;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.1 * scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + COLORS.green + ',' + (alpha * 0.5).toFixed(3) + ')';
            ctx.fill();
        }
    }

    function drawDrift() {
        var linkDist = isMobile() ? 90 : 130;
        for (var i = 0; i < driftNodes.length; i++) {
            var a = driftNodes[i];
            a.x += a.vx;
            a.y += a.vy;

            // Mouse influence -- gentle push away
            if (mouse.active) {
                var mdx = a.x - mouse.x, mdy = a.y - mouse.y;
                var md = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < 160 && md > 0) {
                    a.x += (mdx / md) * 0.6;
                    a.y += (mdy / md) * 0.6;
                }
            }

            // Wrap edges
            if (a.x < -10) a.x = width + 10;
            if (a.x > width + 10) a.x = -10;
            if (a.y < -10) a.y = height + 10;
            if (a.y > height + 10) a.y = -10;

            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
            ctx.fill();

            // Connect to neighbours
            for (var j = i + 1; j < driftNodes.length; j++) {
                var b = driftNodes[j];
                var dx = a.x - b.x, dy = a.y - b.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDist) {
                    var op = (1 - dist / linkDist) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = 'rgba(' + COLORS.green + ',' + op.toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function frame() {
        if (!running) return;
        ctx.clearRect(0, 0, width, height);
        rotation += 0.0016;
        drawGlobe();
        drawDrift();
        rafId = requestAnimationFrame(frame);
    }

    function start() {
        if (running || prefersReduced) return;
        running = true;
        frame();
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, width, height);
    }

    // Pause when tab hidden to save resources
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { stop(); }
        else { start(); }
    });

    window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    }, { passive: true });
    window.addEventListener('mouseout', function () { mouse.active = false; });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { dpr = Math.min(window.devicePixelRatio || 1, 2); resize(); }, 200);
    });

    window.OrbitParticles = { start: start, stop: stop };

    if (prefersReduced) {
        canvas.style.display = 'none';
        return;
    }

    resize();
    start();
})();

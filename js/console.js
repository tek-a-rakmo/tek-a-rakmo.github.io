/* ============================================================
   console.js — Boot sequence, layer stack, telemetry, stage FX
   ============================================================ */
(function () {
    'use strict';

    var LAYER_META = {
        acquire:   { label: 'ACQUIRE', coord: '41.70°N 73.90°W', signal: 82 },
        signal:    { label: 'BIO-SIGNAL', coord: '42.45°N 76.48°W', signal: 91 },
        waypoints: { label: 'WAYPOINTS', coord: 'MULTI', signal: 88 },
        matrix:    { label: 'CAPABILITY MATRIX', coord: 'N/A', signal: 95 },
        fieldlog:  { label: 'FIELD LOG', coord: 'REMOTE', signal: 78 },
        analysis:  { label: 'ANALYSIS', coord: 'VARIABLE', signal: 93 },
        truth:     { label: 'GROUND TRUTH', coord: 'VERIFIED', signal: 100 },
        transmit:  { label: 'TRANSMIT', coord: 'UPLINK', signal: 100 }
    };

    var FIELD_LINES = [
        '[2025-10-01T00:00Z] LOG START — operator session initiated',
        '[2025-10-15T14:22Z] SIMULACRUM :: contributing to Chronax (JAX time-series library)',
        '[2025-11-02T09:10Z] SIMULACRUM :: benchmarking framework vs StatsForecast — PASS',
        '[2025-11-18T16:45Z] SIMULACRUM :: TestPyPI release pipeline — OK',
        '[2025-12-01T11:30Z] SIMULACRUM :: paper contribution on Chronax — submitted',
        '[2025-05-12T08:00Z] CORNELL FDL :: RISC study — field design locked',
        '[2025-06-14T13:55Z] CORNELL FDL :: starved-power moisture sensor integrated',
        '[2025-07-22T10:20Z] CORNELL FDL :: CHIMES sensor bar GPS-enabled — deployed',
        '[2025-08-01T17:00Z] CORNELL FDL :: ArcGIS plot maps delivered',
        '[2023-07-10T09:00Z] COGNIZANT :: ATLAS digitization — batch 1/12 complete',
        '[2024-03-15T14:00Z] COGNIZANT :: 5000+ road features — 98% accuracy',
        '[2024-06-30T18:00Z] COGNIZANT :: QA cycle 3000+ tasks — client delivery OK',
        '[END] awaiting next field event…'
    ];

    var MACHINE_READOUT = [
        'SUBJECT: OMKAR_TEKAWADE',
        'CLASS: Geospatial Analyst / ML Engineer',
        'ORIGIN: Pune, IN → Ithaca, US',
        'EDU: Cornell MPS (4.075/4.3) | MPKV B.Tech (8.54/10)',
        'CURRENT: Simulacrum Inc. — Product Research Intern',
        'STACK: Python,JAX,R,JS,SQL | ArcGIS,QGIS,GEE',
        'DOMAINS: Remote Sensing, Time Series, Digital Agronomy',
        'CONFIDENCE: 0.94 | AGENCY: HUMAN-IN-LOOP',
        'STATUS: receptive to collaboration'
    ].join('\n');

    var boot = document.getElementById('boot');
    var bootLog = document.getElementById('boot-log');
    var bootEnter = document.getElementById('boot-enter');
    var consoleEl = document.getElementById('console');
    var layers = document.querySelectorAll('.layer');
    var layerBtns = document.querySelectorAll('.layer-btn');
    var currentLayer = 'acquire';
    var radarChart = null;
    var fieldLogDone = false;
    var readoutDone = false;
    var metricsDone = false;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Boot ---------- */
    function runBoot() {
        if (prefersReduced || !boot) {
            finishBoot();
            return;
        }
        var lines = [
            '> INITIALIZING SENSOR CONSOLE v2.0…',
            '> ACQUIRING ORBITAL LINK………… OK',
            '> LOADING LAYER STACK…………… 8 LAYERS',
            '> OPERATOR: OMKAR TEKAWADE',
            '> HUMAN-AGENCY MODE: ENABLED',
            '> STATUS: READY FOR INSPECTION'
        ];
        var i = 0;
        function next() {
            if (i >= lines.length) {
                bootEnter.hidden = false;
                return;
            }
            bootLog.textContent += lines[i] + '\n';
            i++;
            setTimeout(next, 380);
        }
        next();

        function enter() { finishBoot(); }
        bootEnter.addEventListener('click', enter);
        document.addEventListener('keydown', function once(e) {
            if (!boot.classList.contains('is-done')) {
                document.removeEventListener('keydown', once);
                enter();
            }
        });
    }

    function finishBoot() {
        if (boot) boot.classList.add('is-done');
        if (consoleEl) consoleEl.classList.add('is-ready');
        initClock();
        positionOrbitTags();
        switchLayer('acquire');
    }

    /* ---------- Layer switching ---------- */
    function switchLayer(id) {
        if (!LAYER_META[id]) return;
        currentLayer = id;
        var meta = LAYER_META[id];

        layerBtns.forEach(function (btn) {
            btn.classList.toggle('is-active', btn.getAttribute('data-layer') === id);
        });
        layers.forEach(function (layer) {
            layer.classList.toggle('is-active', layer.getAttribute('data-layer') === id);
        });

        document.getElementById('telemetry-layer').textContent = 'LAYER: ' + meta.label;
        document.getElementById('telemetry-coord').textContent = meta.coord;
        document.getElementById('telemetry-signal').textContent =
            'SIGNAL ' + signalBar(meta.signal) + ' ' + meta.signal + '%';

        if (id === 'signal' && !readoutDone) typeReadout();
        if (id === 'fieldlog' && !fieldLogDone) streamFieldLog();
        if (id === 'matrix' && !radarChart) buildRadar();
        if (id === 'analysis' && !metricsDone) animateMetrics();
    }

    function signalBar(pct) {
        var filled = Math.round(pct / 10);
        var s = '';
        for (var i = 0; i < 10; i++) s += i < filled ? '█' : '░';
        return s;
    }

    layerBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchLayer(btn.getAttribute('data-layer'));
            closeDrawer();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (document.getElementById('brief') && document.getElementById('brief').classList.contains('is-open')) return;
        var key = e.key;
        if (key >= '1' && key <= '8') {
            var btn = document.querySelector('.layer-btn[data-key="' + key + '"]');
            if (btn) switchLayer(btn.getAttribute('data-layer'));
        }
    });

    /* ---------- Telemetry clock ---------- */
    function initClock() {
        var el = document.getElementById('telemetry-clock');
        if (!el) return;
        function tick() {
            var d = new Date();
            el.textContent = d.toISOString().slice(11, 19) + ' UTC';
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ---------- Machine readout typewriter ---------- */
    function typeReadout() {
        readoutDone = true;
        var el = document.getElementById('readout-machine');
        if (!el || prefersReduced) { if (el) el.textContent = MACHINE_READOUT; return; }
        var i = 0;
        (function step() {
            el.textContent = MACHINE_READOUT.slice(0, i);
            i += 2;
            if (i <= MACHINE_READOUT.length) requestAnimationFrame(step);
            else el.textContent = MACHINE_READOUT;
        })();
    }

    /* ---------- Field log stream ---------- */
    function streamFieldLog() {
        fieldLogDone = true;
        var el = document.getElementById('fieldlog-stream');
        if (!el) return;
        if (prefersReduced) { el.textContent = FIELD_LINES.join('\n'); return; }
        var idx = 0;
        el.textContent = '';
        function next() {
            if (idx >= FIELD_LINES.length) return;
            el.textContent += (idx ? '\n' : '') + FIELD_LINES[idx];
            el.scrollTop = el.scrollHeight;
            idx++;
            setTimeout(next, 420);
        }
        next();
    }

    /* ---------- Radar chart ---------- */
    function buildRadar() {
        if (typeof Chart === 'undefined') return;
        var canvas = document.getElementById('skills-radar');
        if (!canvas) return;
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'JetBrains Mono', monospace";
        radarChart = new Chart(canvas.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Analysis', 'Programming', 'Software', 'Agronomy'],
                datasets: [{
                    data: [5, 4.3, 4.6, 4.2],
                    fill: true,
                    backgroundColor: 'rgba(16,185,129,0.2)',
                    borderColor: '#10b981',
                    pointBackgroundColor: '#10b981',
                    pointRadius: 4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        min: 0, max: 5,
                        ticks: { display: false },
                        grid: { color: 'rgba(30,41,59,0.6)' },
                        angleLines: { color: 'rgba(30,41,59,0.6)' },
                        pointLabels: { color: '#e2e8f0', font: { size: 11 } }
                    }
                }
            }
        });
    }

    /* ---------- Orbit tags positioning ---------- */
    function positionOrbitTags() {
        var orbit = document.getElementById('skill-orbit');
        if (!orbit) return;
        var tags = orbit.querySelectorAll('.orbit-tag');
        var n = tags.length;
        var cx = 50, cy = 50, r = 42;
        tags.forEach(function (tag, i) {
            var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
            tag.style.left = (cx + Math.cos(angle) * r) + '%';
            tag.style.top = (cy + Math.sin(angle) * r) + '%';
            tag.style.transform = 'translate(-50%, -50%)';
        });
    }

    /* ---------- Metrics count-up ---------- */
    function animateMetrics() {
        metricsDone = true;
        document.querySelectorAll('.metric__n').forEach(function (el) {
            var target = parseFloat(el.getAttribute('data-count')) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            if (prefersReduced) { el.textContent = fmt(target) + suffix; return; }
            var v = 0;
            var step = function () {
                v += (target - v) * 0.12;
                if (Math.abs(target - v) < 1) { el.textContent = fmt(target) + suffix; return; }
                el.textContent = fmt(v) + suffix;
                requestAnimationFrame(step);
            };
            step();
        });
    }
    function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

    /* ---------- Waypoint hover sync ---------- */
    document.querySelectorAll('.wp-card, .waypoint-pin').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            var wp = el.getAttribute('data-wp');
            document.querySelectorAll('[data-wp="' + wp + '"]').forEach(function (n) { n.classList.add('is-hot'); });
        });
        el.addEventListener('mouseleave', function () {
            var wp = el.getAttribute('data-wp');
            document.querySelectorAll('[data-wp="' + wp + '"]').forEach(function (n) { n.classList.remove('is-hot'); });
        });
    });

    /* ---------- Mobile drawer ---------- */
    var fab = document.getElementById('layer-fab');
    var drawer = document.getElementById('layer-drawer');
    if (fab && drawer) {
        var list = document.getElementById('layer-list');
        if (list) drawer.appendChild(list.cloneNode(true));
        drawer.querySelectorAll('.layer-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchLayer(btn.getAttribute('data-layer'));
                closeDrawer();
            });
        });
        fab.addEventListener('click', function () {
            drawer.classList.add('is-open');
            drawer.setAttribute('aria-hidden', 'false');
        });
    }
    function closeDrawer() {
        if (drawer) { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
    }

    window.OrbitConsole = { switchLayer: switchLayer };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runBoot);
    } else {
        runBoot();
    }
})();

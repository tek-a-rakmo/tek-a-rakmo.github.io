/* ============================================================
   projects.js — Mission carousel + brief overlay + charts
   ============================================================ */
(function () {
    'use strict';

    var IMG = 'https://raw.githubusercontent.com/ot73/portfolio_images/main/';
    var activeChart = null;

    var missions = [
        {
            id: 'rooftop',
            title: 'Rooftop Agriculture Suitability, NYC',
            category: 'URBAN DATA SCIENCE',
            summary: '1M+ buildings processed. 36,345 suitable rooftops identified across 6,502 acres.',
            thumb: 'rooftop%20agriculture.png',
            desc: 'City-wide GIS suitability model integrating MapPLUTO, building footprints, and LiDAR DSMs via pyogrio pipeline.',
            methodology: ['Multi-criteria classification with zoning + structural filters', 'ArcGIS Pro solar/slope + Python pipelining', 'Suitability score matrix for commercial farming'],
            impact: ['36,345 rooftops · 6,502 acres', 'Solar threshold >528 kWh/m²/year'],
            gallery: ['rooftop%20agriculture.png', 'huntspoint.png', 'percenthunts.png']
        },
        {
            id: 'air-quality',
            title: 'Urban Agriculture & Air Quality',
            category: 'SPATIAL ANALYSIS',
            summary: '2,000+ UA sites vs 15 years of PM2.5/NO/NO2 — site-placement bias revealed.',
            thumb: 'UA_map.jpg',
            desc: 'PyQGIS pipeline comparing urban agriculture sites against spatially controlled random points within 300m buffers.',
            methodology: ['Automated buffer + zonal statistics', '2,618 control reference points', 'Raster extraction 2008–2022'],
            impact: ['Higher pollution at UA locations', 'Evidence for planning intervention'],
            chart: 'air',
            extraData: {
                years: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022],
                'PM2.5': { ua: [10.8,10.2,9.5,9.8,8.8,9.2,8.5,7.8,7.5,6.8,6.5,7.2,6.2,6.8,8.2], random: [9.8,9.5,8.6,9,8.1,8.5,7.6,7.1,6.8,6.1,5.8,6.5,5.5,6.1,7.5] },
                'NO': { ua: [26.5,25.0,25.5,21.0,23.5,20.0,18.0,17.5,17.0,14.0,12.5,13.0,12.8,12.5,13.5], random: [21.0,20.5,21.0,16.5,17.5,15.0,13.5,13.0,12.8,11.0,10.5,10.8,10.5,10.2,11.0] },
                'NO2': { ua: [26.0,25.5,24.5,23.5,22.5,22.0,21.5,21.0,21.0,19.5,19.0,19.5,17.0,17.5,16.5], random: [20.0,19.5,19.0,18.0,17.0,16.5,16.0,15.5,15.5,14.5,14.0,14.5,13.0,13.5,14.5] }
            },
            gallery: ['UA_map.jpg', 'PM_map.jpg', 'final_graph.png']
        },
        {
            id: 'sav',
            title: 'Mapping SAV in Senegal',
            category: 'REMOTE SENSING',
            summary: 'Sentinel-2 + WAVI workflow. Seasonal peak ~3,000 km². Multi-year expansion detected.',
            thumb: 'sav2019.jpg',
            desc: 'Google Earth Engine spatio-temporal system mapping submerged aquatic vegetation for schistosomiasis habitat monitoring.',
            methodology: ['WAVI pixel classification', 'JRC Global Surface Water integration', 'Seasonal dynamics 2019–2024'],
            impact: ['Peak coverage ~3,000 km²', 'Public-health relevant habitat tool'],
            chart: 'sav',
            gallery: ['monthly_grid.png', 'sav2019.jpg', 'sav20192024.png']
        },
        {
            id: 'cart',
            title: 'Collegetown Cart',
            category: 'BUSINESS INNOVATION',
            summary: 'Food-truck rental model for Ithaca restaurants facing seasonal revenue collapse.',
            thumb: 'Food_truck_locations.png',
            desc: 'Primary research with 10+ restaurant owners. Low-capital mobility solution for off-peak seasons.',
            methodology: ['Market research + survey analysis', 'Pain point mapping', 'Location feasibility study'],
            impact: ['Resilience model for Collegetown', 'Reduced capital barrier vs ownership'],
            gallery: ['Food_truck_locations.png']
        }
    ];

    function buildCarousel() {
        var wrap = document.getElementById('missions-carousel');
        if (!wrap) return;
        wrap.innerHTML = '';
        missions.forEach(function (m) {
            var card = document.createElement('article');
            card.className = 'mission-card';
            card.innerHTML =
                '<img class="mission-card__img" src="' + IMG + m.thumb + '" alt="" loading="lazy">' +
                '<div class="mission-card__body">' +
                '<span class="mission-card__cat">' + m.category + '</span>' +
                '<h3 class="mission-card__title">' + m.title + '</h3>' +
                '<p class="mission-card__sum">' + m.summary + '</p></div>' +
                '<span class="mission-card__open">OPEN MISSION BRIEF →</span>';
            card.addEventListener('click', function () { openBrief(m); });
            wrap.appendChild(card);
        });
    }

    function openBrief(m) {
        var brief = document.getElementById('brief');
        var panel = document.getElementById('brief-panel');
        if (!brief || !panel) return;

        var chartBlock = '';
        if (m.chart === 'air') {
            chartBlock = '<div class="pollutant-row">' +
                '<button class="is-on" data-p="PM2.5">PM2.5</button><button data-p="NO">NO</button><button data-p="NO2">NO2</button></div>' +
                '<div class="chart-wrap"><canvas id="brief-chart"></canvas></div>';
        } else if (m.chart === 'sav') {
            chartBlock = '<div class="chart-wrap"><canvas id="brief-chart"></canvas></div>';
        }

        var gal = m.gallery.map(function (g) {
            return '<img src="' + IMG + g + '" alt="" data-zoom loading="lazy">';
        }).join('');

        panel.innerHTML =
            '<div class="brief__inner">' +
            '<button class="brief__close" aria-label="Close">&times;</button>' +
            '<p class="brief__cat">' + m.category + '</p>' +
            '<h2 class="brief__title">' + m.title + '</h2>' +
            '<p style="color:var(--text-dim);font-size:0.9rem;margin-bottom:1rem">' + m.desc + '</p>' +
            '<div class="brief__cols"><div><h4>Methodology</h4><ul>' +
            m.methodology.map(function (x) { return '<li>' + x + '</li>'; }).join('') +
            '</ul></div><div><h4>Impact</h4><ul>' +
            m.impact.map(function (x) { return '<li>' + x + '</li>'; }).join('') +
            '</ul></div></div>' + chartBlock +
            '<div class="brief__gallery">' + gal + '</div></div>';

        brief.classList.add('is-open');
        brief.setAttribute('aria-hidden', 'false');

        panel.querySelector('.brief__close').addEventListener('click', closeBrief);
        brief.addEventListener('click', function onBg(e) {
            if (e.target === brief) { closeBrief(); brief.removeEventListener('click', onBg); }
        });
        panel.querySelectorAll('[data-zoom]').forEach(function (img) {
            img.addEventListener('click', function () { openLightbox(img.src); });
        });

        if (m.chart) initChart(m);
    }

    function initChart(m) {
        if (typeof Chart === 'undefined') return;
        if (activeChart) { activeChart.destroy(); activeChart = null; }
        var canvas = document.getElementById('brief-chart');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        Chart.defaults.color = '#94a3b8';

        if (m.chart === 'air') {
            var p = 'PM2.5';
            activeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: m.extraData.years,
                    datasets: [
                        { label: 'UA Sites', data: m.extraData[p].ua, borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16,185,129,0.12)', tension: 0.35 },
                        { label: 'Control', data: m.extraData[p].random, borderColor: '#f59e0b', fill: true, backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.35 }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
            document.querySelectorAll('.pollutant-row button').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var key = btn.getAttribute('data-p');
                    activeChart.data.datasets[0].data = m.extraData[key].ua;
                    activeChart.data.datasets[1].data = m.extraData[key].random;
                    activeChart.update();
                    document.querySelectorAll('.pollutant-row button').forEach(function (b) { b.classList.remove('is-on'); });
                    btn.classList.add('is-on');
                });
            });
        } else if (m.chart === 'sav') {
            activeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    datasets: [{
                        label: 'SAV km²',
                        data: [2600,2550,2500,2500,2550,2500,2450,2250,1100,1900,2400,2650],
                        borderColor: '#3b82f6', fill: true, backgroundColor: 'rgba(59,130,246,0.15)', tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    function closeBrief() {
        var brief = document.getElementById('brief');
        if (brief) { brief.classList.remove('is-open'); brief.setAttribute('aria-hidden', 'true'); }
        if (activeChart) { activeChart.destroy(); activeChart = null; }
    }

    function openLightbox(src) {
        var lb = document.getElementById('lightbox');
        var img = document.getElementById('lightbox-img');
        if (lb && img) { img.src = src; lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); }
    }
    function closeLightbox() {
        var lb = document.getElementById('lightbox');
        if (lb) { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); }
    }

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeBrief(); closeLightbox(); }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildCarousel);
    } else {
        buildCarousel();
    }
})();

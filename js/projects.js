/* ============================================================
   projects.js -- Project data, card rendering, modal,
   Chart.js visualisations, and lightbox.
   Exposes window.OrbitProjects.renderCards() which animations.js
   calls so reveal triggers can attach after cards exist.
   ============================================================ */
(function () {
    'use strict';

    var IMG = 'https://raw.githubusercontent.com/ot73/portfolio_images/main/';

    var projects = [
        {
            id: 'rooftop-agriculture',
            title: 'Rooftop Agriculture Suitability, NYC',
            category: 'Urban Data Science / Python + ArcGIS',
            date: 'May 2025',
            summary: 'A city-wide GIS suitability model processing over one million buildings to find rooftops fit for commercial farming.',
            desc: 'Built a hybrid Python data pipeline for a city-wide GIS suitability model, integrating building footprints, MapPLUTO land-use data, and LiDAR-derived DSMs. Rooftops were categorised for intensive vs. extensive farming by combining solar radiation analysis with structural capacity.',
            methodology: [
                'Processed 1M+ buildings via a high-speed pyogrio pipeline.',
                'Filtered MapPLUTO and Building Footprint data by zoning and structural capacity.',
                'Combined ArcGIS Pro solar/slope analysis with Python data pipelining.'
            ],
            impact: [
                'Identified 36,345 suitable rooftops (6,502 acres).',
                'Applied a solar threshold of >528 kWh/m\u00b2/year.',
                'Built a suitability score matrix to prioritise farming potential.'
            ],
            gallery: [
                { src: 'rooftop%20agriculture.png', cap: 'Suitability Map' },
                { src: 'huntspoint.png', cap: 'Hunts Point Case Study' },
                { src: 'percenthunts.png', cap: 'Distribution Statistics' }
            ]
        },
        {
            id: 'air-quality',
            title: 'Urban Agriculture & Air Quality',
            category: 'Spatial Analysis / PyQGIS',
            date: 'May 2025',
            summary: 'Automated comparison of 2,000+ urban agriculture sites against 15 years of pollution data, revealing site-placement bias.',
            desc: 'Automated a comparative spatial analysis in QGIS to assess the relationship between 2,000+ urban agriculture sites and long-term air quality (PM2.5, NO, NO2) from 2008 to 2022, using raster extraction and zonal statistics within 300m buffers.',
            methodology: [
                'Used PyQGIS to automate buffer analysis and zonal statistics.',
                'Compared UA sites against 2,618 spatially controlled random reference points.',
                'Isolated specific air-quality impacts from background variation.'
            ],
            impact: [
                'Revealed consistently higher pollution exposure at UA locations.',
                'Surfaced evidence of site-placement bias for urban planning.'
            ],
            chartType: 'air-quality',
            gallery: [
                { src: 'UA_map.jpg', cap: 'Urban Ag Sites' },
                { src: 'PM_map.jpg', cap: 'PM2.5 Surface' },
                { src: 'final_graph.png', cap: 'Comparative Trend' }
            ],
            extraData: {
                years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
                'PM2.5': { ua: [10.8, 10.2, 9.5, 9.8, 8.8, 9.2, 8.5, 7.8, 7.5, 6.8, 6.5, 7.2, 6.2, 6.8, 8.2], random: [9.8, 9.5, 8.6, 9, 8.1, 8.5, 7.6, 7.1, 6.8, 6.1, 5.8, 6.5, 5.5, 6.1, 7.5] },
                'NO': { ua: [26.5, 25.0, 25.5, 21.0, 23.5, 20.0, 18.0, 17.5, 17.0, 14.0, 12.5, 13.0, 12.8, 12.5, 13.5], random: [21.0, 20.5, 21.0, 16.5, 17.5, 15.0, 13.5, 13.0, 12.8, 11.0, 10.5, 10.8, 10.5, 10.2, 11.0] },
                'NO2': { ua: [26.0, 25.5, 24.5, 23.5, 22.5, 22.0, 21.5, 21.0, 21.0, 19.5, 19.0, 19.5, 17.0, 17.5, 16.5], random: [20.0, 19.5, 19.0, 18.0, 17.0, 16.5, 16.0, 15.5, 15.5, 14.5, 14.0, 14.5, 13.0, 13.5, 14.5] }
            }
        },
        {
            id: 'sav-mapping',
            title: 'Mapping Submerged Aquatic Vegetation',
            category: 'Remote Sensing / Google Earth Engine',
            date: 'Nov 2024',
            summary: 'A spatio-temporal system using Sentinel-2 to map snail-habitat vegetation across Senegal, peaking at 3,000 km\u00b2.',
            desc: 'Engineered a spatio-temporal remote sensing system (2019-2024) in Google Earth Engine using Sentinel-2 imagery and JRC Global Surface Water datasets to map Submerged Aquatic Vegetation (SAV) and monitor freshwater habitats for parasite-carrying snails linked to Schistosomiasis.',
            methodology: [
                'Developed a pixel-based classification using the Water Adjusted Vegetation Index (WAVI).',
                'Modelled distinct seasonal dynamics of growth and recession.',
                'Detected a multi-year expansion trend across the study period.'
            ],
            impact: [
                'Quantified seasonal SAV coverage peaking at ~3,000 km\u00b2.',
                'Provided a habitat-monitoring tool with public-health relevance.'
            ],
            chartType: 'sav',
            gallery: [
                { src: 'monthly_grid.png', cap: 'Monthly Composite Grid' },
                { src: 'sav2019.jpg', cap: 'SAV Extent 2019' },
                { src: 'sav20192024.png', cap: 'Multi-Year Trend' }
            ]
        },
        {
            id: 'collegetown-cart',
            title: 'Collegetown Cart: Business Innovation',
            category: 'Business Strategy / Market Research',
            date: 'Innovation Project',
            summary: 'A food-truck rental model to counter seasonal revenue decline for Ithaca restaurants, grounded in primary research.',
            desc: 'Identified a key challenge for Ithaca\'s Collegetown restaurants: significant revenue decline during summer and winter breaks. The team developed "Collegetown Cart," a business model for a food-truck rental service to make local businesses more resilient.',
            methodology: [
                'Conducted primary research with 10+ restaurant owners and tourism officials.',
                'Analysed survey data to understand dining habits.',
                'Identified pain points: inconsistent hours and financial strain.'
            ],
            impact: [
                'Proposed a low-capital rental service vs. outright truck purchase.',
                'Enabled businesses to reach high-traffic areas in off-peak seasons.'
            ],
            gallery: [
                { src: 'Food_truck_locations.png', cap: 'Proposed Food Truck Locations', single: true }
            ]
        }
    ];

    var modal = document.getElementById('modal');
    var modalPanel = document.getElementById('modal-panel');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var activeChart = null;
    var lastFocused = null;

    function arrowSvg() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>';
    }

    function renderCards() {
        var wrap = document.getElementById('project-cards');
        if (!wrap) return;
        wrap.innerHTML = '';
        projects.forEach(function (p) {
            var card = document.createElement('article');
            card.className = 'project-card';
            card.setAttribute('data-reveal', '');
            card.setAttribute('data-hover', '');
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Open project: ' + p.title);
            card.innerHTML =
                '<p class="project-card__cat">' + p.category + '</p>' +
                '<h3 class="project-card__title">' + p.title + '</h3>' +
                '<p class="project-card__summary">' + p.summary + '</p>' +
                '<span class="project-card__cta">View analysis ' + arrowSvg() + '</span>';

            card.addEventListener('click', function () { openModal(p); });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(p); }
            });
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
            });
            wrap.appendChild(card);
        });
    }

    function galleryHtml(p) {
        var single = p.gallery.length === 1 && p.gallery[0].single;
        var items = p.gallery.map(function (g) {
            return '<figure class="gallery-item">' +
                '<img src="' + IMG + g.src + '" alt="' + g.cap + '" loading="lazy" data-zoom>' +
                '<p>' + g.cap + '</p></figure>';
        }).join('');
        return '<div class="modal__gallery"><h4>Gallery</h4>' +
            '<div class="gallery-grid' + (single ? ' gallery-grid--single' : '') + '">' + items + '</div></div>';
    }

    function chartHtml(p) {
        if (p.chartType === 'air-quality') {
            return '<div class="modal__chart-wrap">' +
                '<h4 class="modal__chart-title">Pollutant Trends (2008-2022)</h4>' +
                '<div class="pollutant-selector">' +
                '<button class="pollutant-btn is-active" data-pollutant="PM2.5">PM2.5</button>' +
                '<button class="pollutant-btn" data-pollutant="NO">NO</button>' +
                '<button class="pollutant-btn" data-pollutant="NO2">NO2</button>' +
                '</div><div class="chart-container"><canvas id="modal-chart"></canvas></div></div>';
        }
        if (p.chartType === 'sav') {
            return '<div class="modal__chart-wrap">' +
                '<h4 class="modal__chart-title">Seasonal Area Variation (2019)</h4>' +
                '<div class="chart-container"><canvas id="modal-chart"></canvas></div></div>';
        }
        return '';
    }

    function openModal(p) {
        lastFocused = document.activeElement;
        modalPanel.innerHTML =
            '<div class="modal__inner">' +
            '<button class="modal__close" aria-label="Close">&times;</button>' +
            '<p class="modal__cat">' + p.category + '</p>' +
            '<h2 class="modal__title">' + p.title + '</h2>' +
            '<p class="modal__date">' + p.date + '</p>' +
            '<p class="modal__desc">' + p.desc + '</p>' +
            '<div class="modal__cols">' +
            '<div><h4>Methodology</h4><ul>' + p.methodology.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul></div>' +
            '<div><h4>Impact</h4><ul>' + p.impact.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul></div>' +
            '</div>' +
            chartHtml(p) +
            galleryHtml(p) +
            '</div>';

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (window.lenisInstance) window.lenisInstance.stop();

        modalPanel.querySelector('.modal__close').addEventListener('click', closeModal);
        var closeBtn = modalPanel.querySelector('.modal__close');
        if (closeBtn) closeBtn.focus();

        if (p.chartType) initChart(p);
    }

    function initChart(p) {
        if (typeof Chart === 'undefined') return;
        var canvas = document.getElementById('modal-chart');
        if (!canvas) return;
        if (activeChart) { activeChart.destroy(); activeChart = null; }
        var ctx = canvas.getContext('2d');
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(30,41,59,0.6)';
        Chart.defaults.font.family = "'Inter', sans-serif";

        if (p.chartType === 'air-quality') {
            var initial = 'PM2.5';
            activeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: p.extraData.years,
                    datasets: [
                        { label: 'Urban Ag Sites', data: p.extraData[initial].ua, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)', fill: true, tension: 0.35 },
                        { label: 'Control Sites', data: p.extraData[initial].random, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)', fill: true, tension: 0.35 }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: false } } }
            });
            modalPanel.querySelectorAll('.pollutant-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var key = btn.getAttribute('data-pollutant');
                    activeChart.data.datasets[0].data = p.extraData[key].ua;
                    activeChart.data.datasets[1].data = p.extraData[key].random;
                    activeChart.update();
                    modalPanel.querySelectorAll('.pollutant-btn').forEach(function (b) { b.classList.remove('is-active'); });
                    btn.classList.add('is-active');
                });
            });
        } else if (p.chartType === 'sav') {
            activeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'SAV Area (km\u00b2)',
                        data: [2600, 2550, 2500, 2500, 2550, 2500, 2450, 2250, 1100, 1900, 2400, 2650],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.18)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (window.lenisInstance) window.lenisInstance.start();
        if (activeChart) { activeChart.destroy(); activeChart = null; }
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
    }
    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
    }

    // Event delegation: backdrop close + gallery zoom
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
        if (e.target.hasAttribute && e.target.hasAttribute('data-zoom')) openLightbox(e.target.src);
    });
    lightbox.addEventListener('click', function (e) { if (e.target !== document.getElementById('lightbox-close')) closeLightbox(); });
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('is-open')) closeLightbox();
            else if (modal.classList.contains('is-open')) closeModal();
        }
    });

    window.OrbitProjects = { renderCards: renderCards };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCards);
    } else {
        renderCards();
    }
})();

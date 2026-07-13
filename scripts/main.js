// =====================================================
// GUIDED TOUR:
// Each step targets a specific DOM element, positions the tour
// callout box near it, and narrates a piece of the data story.
// =====================================================

const TOUR_STEPS = [
  {
    element: "#hero",
    anchor: "bottom",
    chapter: "Introduction",
    title: "Why Do Some People Live Longer?",
    text: "Across the world, life expectancy varies by more than 30 years. A child born in Japan today can expect to reach their mid-80s; one born in a conflict-affected nation may not see 60. This dashboard explores three powerful forces behind that gap  economic development, healthcare investment, and the devastating impact of armed conflict  across 60+ years of World Bank data from 200+ countries. This dashboard is designed for multiple audiences. Explore how it helps you below.",
    insight: "Life expectancy is not just a health metric. It is the sum of a society's choices.",
    onEnter: () => {
      const container = document.getElementById("tour-text");

      const audienceHTML = `
        <div class="audience-box-container">
          
          <div class="audience-box">
            <div class="audience-header">
              Policy Makers & NGOs
              <span class="info-btn" data-info="Identify regions with low life expectancy and direct healthcare funding and aid more effectively.">i</span>
            </div>
          </div>

          <div class="audience-box">
            <div class="audience-header">
              Journalists & Researchers
              <span class="info-btn" data-info="Explore relationships between conflict, economy, and health to support data-driven storytelling and analysis.">i</span>
            </div>
          </div>

          <div class="audience-box">
            <div class="audience-header">
              Students & Educators
              <span class="info-btn" data-info="Understand global inequality through interactive visualisations and compare countries across multiple dimensions.">i</span>
            </div>
          </div>

        </div>
      `;

      container.insertAdjacentHTML("beforeend", audienceHTML);

      // Tooltip logic
      document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
          const tip = document.getElementById('tooltip');
          tip.innerHTML = e.target.dataset.info;
          tip.style.opacity = '1';
        });

        btn.addEventListener('mousemove', moveTip);
        btn.addEventListener('mouseleave', hideTip);
      });
    }
  },
  {
    element: "#slider-container",
    anchor: "bottom",
    chapter: "Chapter 1: Time",
    title: "Six Decades of Change",
    text: "Use the Year Slider to travel through time. The global average life expectancy has risen from around 52 years in 1960 to over 72 years by 2019 a remarkable achievement of modern medicine, sanitation, and development. But progress has not been equal. Hit ▶ Play to watch the world evolve, and notice which regions keep pace and which fall behind.",
    insight: "The world gained ~20 years of life expectancy in 60 years. However that figure varies geographically.",
    onEnter: null
  },
  {
    element: "#top-row",
    anchor: "bottom",
    chapter: "Chapter 2: Geography",
    title: "The World Map of Life",
    text: "The choropleth map colours each country by its life expectancy, with green for higher and red for lower. At a glance, the pattern is stark: Europe and East Asia glow green; much of Sub-Saharan Africa and conflict zones are deep red. Click any country to select it and watch all four charts update simultaneously. Try selecting several countries from different regions to compare their trajectories.",
    insight: "Click a country on the map to reflect the changes in all charts.",
    onEnter: null
  },
  {
    element: "#bubble-svg",
    anchor: "top",
    chapter: "Chapter 3: Wealth & Health",
    title: "Money, Medicine, and Longevity",
    text: "The bubble chart plots GDP per Capita (x-axis) against Life Expectancy (y-axis). The relationship is strong but not linear; wealthier nations tend to live longer, yet some middle-income countries punch above their weight through smart healthcare investment. Use the dropdowns to switch axes and colouring. Colour by Region to see clusters; switch Size to Health Expenditure to reveal how spending amplifies (or fails to amplify) wealth into longer lives.",
    insight: "Beyond ~$15,000 GDP/capita, life expectancy gains slow. It depends on how wealth is spent.",
    onEnter: null
  },
  {
    element: "#parallel-svg",
    anchor: "top",
    chapter: "Chapter 4: Multi-Factor Analysis",
    title: "What Drives Life Expectancy?",
    text: "The parallel coordinates plot brings multiple dimensions together. The vertical axes of the plot show three essential elements which include economic prosperity and healthcare investment and life expectancy. The graph shows all countries through its lines. Patterns emerge quickly because wealthier nations display their GDP and life expectancy at higher levels whereas conflict-affected or low-income countries show completely different results. The user can drag any axis to filter and isolate particular patterns which exist between different countries.",
    insight: "Brush an axis to reveal hidden country patterns.",
    onEnter: null
  },
  {
    element: "#boxplot-svg",
    anchor: "top",
    chapter: "Chapter 5: Conflict",
    title: "The Brutal Cost of War",
    text: "This box plot tells perhaps the starkest story on the page. The distribution of life expectancy for conflict-affected nations sits entirely below that of stable ones. The gap between the two medians typically exceeds 10 years. Conflict doesn't just kill people directly; it destroys hospitals, displaces doctors, cuts food supply chains, and erases a generation of public health infrastructure. The jitter dots represent individual countries; notice how conflict-affected nations cluster at the very bottom.",
    insight: "A decade of life expectancy erased not by disease, but by the choice to go to war.",
    onEnter: null
  },
  {
    element: "#linechart-svg",
    anchor: "top",
    chapter: "Chapter 6: Trends",
    title: "Tracing Trajectories Over Time",
    text: "The line chart shows how life expectancy has trended across world regions over the full dataset. By default it shows regional averages, but its real power comes when you select countries on the map. Compare Japan, Syria, and Sierra Leone to see three radically different stories unfold: steady rise, war-driven collapse, and slow recovery. The white vertical line marks the currently selected year across all charts.",
    insight: "Select countries on the map to compare individual trajectories side-by-side.",
    onEnter: null
  },
  {
    element: "#stats-section",
    anchor: "top",
    chapter: "Chapter 7: Deep Dive",
    title: "Country-Level Statistics",
    text: "The stats bar at the bottom summarises the current selection. Select a single country to see its average GDP, healthcare spending, and life expectancy, with delta arrows showing year-on-year change. The ranking table below orders countries by life expectancy; you can group by Region or Income Group to find structural patterns. Click any row in the table to add that country to your comparison.",
    insight: "Use the ranking table to discover which countries defy their income group's expectations.",
    onEnter: null
  },
  {
    element: "#hero",
    anchor: "center",
    chapter: "Conclusion",
    title: "Your Turn to Explore",
    text: "You've completed the guided story, but the data has far more to reveal. Try selecting a set of countries and pressing Play to watch the graphs change in real time. Switch the bubble chart to colour by Region instead of Conflict to spot geographic clusters. Dig into the ranking table to find the outliers that break the rules.",
    insight: "",
    onEnter: null
  }
];

let currentStep = 0;

let tourActive = false;

// Tour Box Description: Calculation of Position
function positionTourBox(target, step) {
  const tourBox = document.getElementById("tour-box");
  if (!target || step.anchor === "center") return;

  const rect = target.getBoundingClientRect();

  let top, left;

  // Center align
  left = rect.left + rect.width / 2 - tourBox.offsetWidth / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - tourBox.offsetWidth - 12));

  if (step.anchor === "top") {
    top = rect.top - tourBox.offsetHeight - 12;
  } else {
    top = rect.bottom + 12;
  }

  if (top + tourBox.offsetHeight > window.innerHeight) {
    top = rect.top - tourBox.offsetHeight - 12;
  }

  if (top < 0) {
    top = rect.bottom + 12;
  }

  tourBox.style.position = "fixed";
  tourBox.style.top = `${top}px`;
  tourBox.style.left = `${left}px`;
}

/**
 * Starts the tour from step 0.
 */
function startTour() {
  currentStep = 0;
  tourActive = true;
  document.getElementById("tour-overlay").style.display = "flex";
  renderTourStep();
}

/**
 * Advances to the next tour step, or ends the tour if on the last step.
 */
function tourNext() {
  if (currentStep < TOUR_STEPS.length - 1) {
    currentStep++;
    renderTourStep();
  } else {
    endTour();
  }
}

/**
 * Moves back to the previous tour step.
 */
function tourPrev() {
  if (currentStep > 0) {
    currentStep--;
    renderTourStep();
  }
}

/**
 * Renders the current tour step:
 */
function renderTourStep() {
  const step = TOUR_STEPS[currentStep];

  // 1. Reset all highlights
  TOUR_STEPS.forEach(s => {
    try {
      const el = document.querySelector(s.element);
      if (el) {
        el.classList.remove('tour-highlighted');
        el.style.zIndex = '';
        el.style.position = '';
        el.style.boxShadow = '';
      }
    } catch(_) {}
  });

  // 2. Highlight target
  const target = document.querySelector(step.element);
  if (target && step.anchor !== 'center') {
    target.classList.add('tour-highlighted');
    target.style.position = 'relative';
    target.style.zIndex = '10010';
    target.style.boxShadow = '0 0 0 4px var(--accent), 0 0 32px rgba(88,166,255,0.35)';
  }

  const textEl = document.getElementById("tour-text");
  textEl.innerHTML = step.text;

  // 3. Update text
  document.getElementById("tour-chapter").textContent = step.chapter;
  document.getElementById("tour-title").textContent = step.title;
  document.getElementById("tour-text").textContent = step.text;

  const insightEl = document.getElementById("tour-insight");
  if (step.insight) {
    insightEl.textContent = `💡 ${step.insight}`;
    insightEl.style.display = 'block';
  } else {
    insightEl.style.display = 'none';
  }

  const tourBox = document.getElementById("tour-box");
  if (target && step.anchor !== 'center') {

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    setTimeout(() => {
      positionTourBox(target, step);
    }, 400);
  }

  // 4. Progress dots & buttons
  const dotsContainer = document.getElementById("tour-dots");
  dotsContainer.innerHTML = '';
  TOUR_STEPS.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'tour-dot' + (i === currentStep ? ' tour-dot-active' : '');
    dot.addEventListener('click', () => { currentStep = i; renderTourStep(); });
    dotsContainer.appendChild(dot);
  });

  document.getElementById("tour-prev").disabled = currentStep === 0;
  const nextBtn = document.getElementById("tour-next");
  nextBtn.textContent = currentStep === TOUR_STEPS.length - 1 ? "Finish ✓" : "Next →";

  document.getElementById("tour-step-count").textContent =
    `${currentStep + 1} / ${TOUR_STEPS.length}`;

  // 5. onEnter callback
  if (typeof step.onEnter === 'function') step.onEnter();
}

/**
 * Ends the tour: hides the overlay and removes all highlight styles.
 */
function endTour() {
  tourActive = false;
  document.getElementById("tour-overlay").style.display = "none";

  TOUR_STEPS.forEach(s => {
    try {
      const el = document.querySelector(s.element);
      if (el) {
        el.classList.remove('tour-highlighted');
        el.style.zIndex = '';
        el.style.position = '';
        el.style.boxShadow = '';
      }
    } catch(_) {}
  });
}

document.getElementById("tour-next").addEventListener('click', tourNext);
document.getElementById("tour-prev").addEventListener('click', tourPrev);
document.getElementById("tour-skip").addEventListener('click', endTour);
document.getElementById("restart-tour").addEventListener('click', startTour);

window.addEventListener('load', () => {
  setTimeout(startTour, 800);
});

window.addEventListener('scroll', () => {
  if (!tourActive) return;
  const step = TOUR_STEPS[currentStep];
  const target = document.querySelector(step.element);
  positionTourBox(target, step);
});

window.addEventListener('resize', () => {
  if (!tourActive) return;
  const step = TOUR_STEPS[currentStep];
  const target = document.querySelector(step.element);
  positionTourBox(target, step);
});

// =====================================================
// DATA & STATE
// =====================================================
const COUNTRY_CODE_MAPPING_PATH = 'data/raw/country-codes.csv';
const WORLD_ATLAS_TOPOLOGY_PATH = 'data/raw/countries-50m.json';

let allData = [];
let selectedCountryCodes = new Set();
let currentYear = 2015;
let yearMin = 1960;
let yearMax = 2023;
let playInterval = null;

// since the data is there for 2024 and 2025 only for conflicts
const MAX_DISPLAY_YEAR = 2023;
let worldGeo = null;
let atlasTopoIdToCountryCode = {};
let mapPointerLeaveHooked = false;
let mapHoveredTopoId = null;
let mapRenderCache = null;

// Chart dimensions
const MARGIN = { top: 20, right: 20, bottom: 45, left: 55 };

// Color schemes
const REGION_COLORS = {
  'Europe & Central Asia': '#58a6ff',
  'East Asia & Pacific': '#3fb950',
  'North America': '#d2a8ff',
  'Latin America & Caribbean': '#e3b341',
  'South Asia': '#f78166',
  'Middle East & North Africa': '#79c0ff',
  'Sub-Saharan Africa': '#ffa657',
  'Other': '#8b949e'
};

const INCOME_SIZE = {
  'High income': 12,
  'Upper middle income': 9,
  'Lower middle income': 6,
  'Low income': 4
};

// =====================================================
// PRE-PROCESSING FUNCTIONS
// =====================================================
function parseCsvRow(row) {
  const num = (v) => {
    const s = String(v ?? '').trim();
    if (s === '' || s === 'NA') return null; // Pre-processing Step 1: Mapping NAs
    const x = parseFloat(s);
    return Number.isFinite(x) ? x : null;
  };
  const bool = (v) => v === 'True' || v === true;
  return {
    year: +row.year,
    country_code: String(row.country_code ?? '').trim(),
    country_name: row.country_name,
    region: row.region || '',
    income_group: row.income_group || '',
    gdp_per_capita_usd: num(row.gdp_per_capita_usd),
    life_expectancy_years: num(row.life_expectancy_years),
    perc_health_expenditure_of_gdp: num(row.perc_health_expenditure_of_gdp),
    is_conflict: bool(row.is_conflict),
    is_aggregated_region: bool(row.is_aggregated_region)
  };
}

function applyYearRangeToUI() {
  const slider = document.getElementById('year-slider');
  slider.min = String(yearMin);
  slider.max = String(yearMax);
  slider.value = String(currentYear);
  slider.disabled = false;
  document.getElementById('year-display').textContent = currentYear;
  document.getElementById('selected-year-label').textContent = currentYear;
  const minEl = document.getElementById('year-slider-min-label');
  const maxEl = document.getElementById('year-slider-max-label');
  if (minEl) minEl.textContent = yearMin;
  if (maxEl) maxEl.textContent = yearMax;
  const countEl = document.getElementById('hero-year-count');
  const rangeEl = document.getElementById('hero-year-range');
  if (countEl && rangeEl) {
    countEl.textContent = String(yearMax - yearMin + 1);
    rangeEl.textContent = `${yearMin}\u2013${yearMax}`;
  }
}

// =====================================================
// creating mapping of world-atlas id (iso3166) to world bank country code for chlropleth
// =====================================================
async function createAtlasTopoIdToCountryCodeMap() {
  const rows = await d3.csv(COUNTRY_CODE_MAPPING_PATH);
  const atlasCol = 'ISO3166-1-numeric'; // topology feat.id (numeric)
  const worldBankCol = 'ISO3166-1-Alpha-3'; // merged_df.country_code (3 letter code)
  const mapping = {};
  for (const row of rows) {
    const worldBankCode = String(row[worldBankCol] ?? '').trim();
    const n = Number(String(row[atlasCol] ?? '').trim());
    if (!/^[A-Z]{3}$/.test(worldBankCode) || !Number.isFinite(n)) continue;
    mapping[n] = worldBankCode;
  }
  return mapping;
}

// =====================================================
// INIT
// =====================================================
async function init() {
  try {
    worldGeo = await d3.json(WORLD_ATLAS_TOPOLOGY_PATH);
  } catch (e) {
    console.warn('Could not load ' + WORLD_ATLAS_TOPOLOGY_PATH + ':', e);
  }

  try {
    atlasTopoIdToCountryCode = await createAtlasTopoIdToCountryCodeMap();
  } catch (e) {
    console.warn('Could not load ' + COUNTRY_CODE_MAPPING_PATH + ':', e);
    atlasTopoIdToCountryCode = {};
  }

  const raw = await d3.csv('data/clean/merged_df.csv', parseCsvRow);
  
  // Pre-processing Step 2: Filtering aggregated noise and enforcing temporal limits
  allData = raw.filter((d) => !d.is_aggregated_region && d.year <= MAX_DISPLAY_YEAR);

  const extent = d3.extent(allData, (d) => d.year);
  yearMin = extent[0] ?? 1960;
  yearMax = extent[1] ?? MAX_DISPLAY_YEAR;
  currentYear = Math.min(Math.max(2015, yearMin), yearMax);

  applyYearRangeToUI();
  setupSlider();
  setupControls();
  drawAll();
}

// =====================================================
// HELPERS
// =====================================================
function getYearData(year) {
  return allData.filter((d) => d.year === year);
}

function getSelectedData(year) {
  const yd = getYearData(year);
  if (selectedCountryCodes.size === 0) return yd;
  return yd.filter((d) => selectedCountryCodes.has(d.country_code));
}

function fmt(n, digits = 0) {
  if (n == null || isNaN(n)) return 'N/A';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'k';
  return n.toFixed(digits);
}

function fmtFixed(n, digits, suffix = '') {
  if (n == null || isNaN(n)) return 'N/A';
  return n.toFixed(digits) + suffix;
}

function mean(arr, key) {
  const vals = arr.map((d) => d[key]).filter((v) => v != null && !isNaN(v));
  return vals.length ? d3.mean(vals) : null;
}

function showTip(event, html) {
  const tip = document.getElementById('tooltip');
  tip.innerHTML = html;
  tip.style.opacity = '1';
  moveTip(event);
}

function moveTip(event) {
  const tip = document.getElementById('tooltip');
  let x = event.clientX + 14;
  let y = event.clientY + 14;
  if (x + 230 > window.innerWidth) x = event.clientX - 230;
  if (y + 120 > window.innerHeight) y = event.clientY - 120;
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}

function hideTip() {
  document.getElementById('tooltip').style.opacity = '0';
}

function getCountryCodeFromAtlasTopoId(id) {
  const n = Number(id);
  return Number.isFinite(n) ? atlasTopoIdToCountryCode[n] : undefined;
}

/** Paths removed in drawMap never receive mouseout; also clears stuck tooltip after redraw. */
function clearMapCountryHoverStyles() {
  hideTip();
  mapHoveredTopoId = null;
  updateMapOutlineLayer();
}

function updateMapOutlineLayer() {
  if (!mapRenderCache) return;
  const { g, countryFeatures, path } = mapRenderCache;
  const outlineFeats = countryFeatures.filter((feat) => {
    const countryCode = getCountryCodeFromAtlasTopoId(feat.id);
    const sel = countryCode && selectedCountryCodes.has(countryCode);
    const hov = mapHoveredTopoId != null && feat.id === mapHoveredTopoId;
    return sel || hov;
  });
  const layerRows = outlineFeats.flatMap((feat) => [
    { feat, layer: 'halo' },
    { feat, layer: 'edge' },
  ]);
  g.selectAll('.country-outline-overlay')
    .data(layerRows, (d) => `${d.feat.id}-${d.layer}`)
    .join('path')
    .attr('class', (d) => `country-outline-overlay country-outline-${d.layer}`)
    .attr('d', (d) => path(d.feat))
    .attr('fill', 'none')
    .attr('pointer-events', 'none')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke', (d) => {
      const { feat } = d;
      const countryCode = getCountryCodeFromAtlasTopoId(feat.id);
      const sel = countryCode && selectedCountryCodes.has(countryCode);
      const hov = mapHoveredTopoId != null && feat.id === mapHoveredTopoId;
      if (d.layer === 'halo') return 'rgba(6, 10, 18, 0.92)';
      if (sel && hov) return '#fff';
      if (sel) return '#fff';
      return '#e6edf3';
    })
    .attr('stroke-width', (d) => {
      const { feat } = d;
      const countryCode = getCountryCodeFromAtlasTopoId(feat.id);
      const sel = countryCode && selectedCountryCodes.has(countryCode);
      const hov = mapHoveredTopoId != null && feat.id === mapHoveredTopoId;
      if (d.layer === 'halo') {
        if (sel && hov) return 2.35;
        if (sel) return 2.15;
        return 2;
      }
      if (sel && hov) return 1.05;
      if (sel) return 0.9;
      return 0.95;
    });
}

function cardW(id) {
  return document.getElementById(id).closest('.card').clientWidth - 40;
}

// =====================================================
// SLIDER & CONTROLS
// =====================================================
function setupSlider() {
  const slider = document.getElementById('year-slider');
  const display = document.getElementById('year-display');

  slider.addEventListener('input', () => {
    currentYear = +slider.value;
    display.textContent = currentYear;
    document.getElementById('selected-year-label').textContent = currentYear;
    drawAll();
  });

  document.getElementById('play-btn').addEventListener('click', () => {
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
      document.getElementById('play-btn').textContent = '\u25B6 Play';
    } else {
      document.getElementById('play-btn').textContent = '\u23F8 Pause';
      playInterval = setInterval(() => {
        let y = +slider.value + 1;
        if (y > yearMax) y = yearMin;
        slider.value = String(y);
        currentYear = y;
        display.textContent = y;
        document.getElementById('selected-year-label').textContent = y;
        drawAll();
      }, 400);
    }
  });
}

function setupControls() {
  ['x-select', 'color-select', 'size-select'].forEach((id) => {
    document.getElementById(id).addEventListener('change', drawBubble);
  });

  document.getElementById('clear-selection').addEventListener('click', () => {
    selectedCountryCodes.clear();
    drawAll();
  });

  document.getElementById('rank-group-select').addEventListener('change', drawRanking);

  const trailsToggle = document.getElementById('toggle-trails');
  if (trailsToggle) {
    trailsToggle.addEventListener('change', () => {
      drawBubble(); // redraw bubble chart when toggled
    });
  }
}

// =====================================================
// DRAW ALL
// =====================================================
function drawAll() {
  drawBubble();
  drawMap();
  drawParallelCoords(); 
  drawBoxplot();
  drawLineChart();
  updateStats();
  drawRanking();
}

// =====================================================
// BUBBLE CHART
// =====================================================
function getCountryHistory(code) {
  return allData
    .filter(d => d.country_code === code)
    .sort((a, b) => a.year - b.year);
}
function drawBubble() {
  const svg = d3.select('#bubble-svg');
  svg.selectAll('*').remove();

  const container = document.getElementById('bubble-svg').closest('.card');
  const W = container.clientWidth - 40;
  const H = 320;
  svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);

  const data = getYearData(currentYear);
  const xKey = document.getElementById('x-select').value;
  const colorMode = document.getElementById('color-select').value;
  const sizeMode = document.getElementById('size-select').value;

  const iw = W - MARGIN.left - MARGIN.right;
  const ih = H - MARGIN.top - MARGIN.bottom;
  const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const xVals = data.map((d) => d[xKey]).filter((v) => v > 0);
  if (!xVals.length) return;

  const xScale = d3.scaleLog()
    .domain([d3.max([d3.min(xVals) * 0.9, 0.1]), d3.max(xVals) * 1.1])
    .range([0, iw]).nice();

  const lifeValsY = data.map((d) => d.life_expectancy_years).filter((v) => v != null && !isNaN(v));
  const yLo = lifeValsY.length ? d3.min(lifeValsY) - 2 : 0;
  const yHi = lifeValsY.length ? d3.max(lifeValsY) + 2 : 100;
  const yScale = d3.scaleLinear()
    .domain([yLo, yHi])
    .range([ih, 0]).nice();

  const sizeScale = sizeMode === 'income_group'
    ? (d) => INCOME_SIZE[d.income_group] || 6
    : d3.scaleSqrt()
      .domain([0, d3.max(data, (d) => d.perc_health_expenditure_of_gdp) || 1])
      .range([3, 18]);

  const colorFn = colorMode === 'is_conflict'
    ? (d) => d.is_conflict ? 'var(--conflict)' : 'var(--stable)'
    : (d) => REGION_COLORS[d.region] || '#8b949e';

  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(yScale).tickSize(-iw).tickFormat(''));
  // g.append('g').attr('class', 'grid').attr('transform', `translate(0,${ih})`)
  //   .call(d3.axisBottom(xScale).ticks(5).tickSize(-ih).tickFormat(''));

  // g.append('g').attr('class', 'axis').attr('transform', `translate(0,${ih})`)
  //   .call(d3.axisBottom(xScale).ticks(5).tickFormat((d) => d >= 1000 ? d3.format('.2s')(d) : d));

  // Fix Added: For Log Ticks for X-Axis
  const logTicks = xScale.ticks(6).filter(d => {
    const log = Math.log10(d);
    return Number.isInteger(log);
  });

  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${ih})`)
    .call(
      d3.axisBottom(xScale)
        .tickValues(logTicks)
        .tickFormat(d3.format('~s'))
    );
  
  g.append('g').attr('class', 'axis').call(d3.axisLeft(yScale).ticks(6));

  g.append('text').attr('class', 'axis-label')
    .attr('x', iw / 2).attr('y', ih + 38).attr('text-anchor', 'middle')
    .text(xKey === 'gdp_per_capita_usd' ? 'GDP per Capita (USD, log scale)' : 'Health Expenditure (% of GDP)');

  g.append('text').attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)').attr('x', -ih / 2).attr('y', -42).attr('text-anchor', 'middle')
    .text('Life Expectancy at Birth (years)');

  const validData = data
    .filter((d) => d[xKey] > 0 && d.life_expectancy_years > 0)
    .slice()
    .sort((a, b) => {
      const sa = selectedCountryCodes.has(a.country_code) ? 1 : 0;
      const sb = selectedCountryCodes.has(b.country_code) ? 1 : 0;
      return sa - sb;
    });

  g.selectAll('.bubble').data(validData, (d) => d.country_code)
    .join(
      (enter) => enter.append('circle')
        .attr('class', (d) => `bubble${selectedCountryCodes.has(d.country_code) ? ' bubble-selected' : ''}`)
        .attr('cx', (d) => xScale(d[xKey]))
        .attr('cy', (d) => yScale(d.life_expectancy_years))
        .attr('r', 0)
        .attr('fill', (d) => colorFn(d))
        .attr('fill-opacity', 0.75)
        .attr('stroke', (d) => selectedCountryCodes.has(d.country_code) ? '#fff' : colorFn(d))
        .attr('stroke-width', (d) => selectedCountryCodes.has(d.country_code) ? 2 : 0.5)
        .call((enter) => enter.transition().duration(500)
          .attr('r', (d) => sizeMode === 'income_group' ? sizeScale(d) : sizeScale(d[sizeMode] || 0))),
      (update) => update
        .attr('class', (d) => `bubble${selectedCountryCodes.has(d.country_code) ? ' bubble-selected' : ''}`)
        .attr('stroke', (d) => selectedCountryCodes.has(d.country_code) ? '#fff' : colorFn(d))
        .attr('stroke-width', (d) => selectedCountryCodes.has(d.country_code) ? 2 : 0.5)
        .attr('fill', (d) => colorFn(d))
        .transition().duration(500)
        .attr('cx', (d) => xScale(d[xKey]))
        .attr('cy', (d) => yScale(d.life_expectancy_years))
        .attr('r', (d) => sizeMode === 'income_group' ? sizeScale(d) : sizeScale(d[sizeMode] || 0))
    )
    .on('mouseover', (event, d) => {
      showTip(event, `<strong>${d.country_name}</strong>
        <div class="tt-row"><span>Life Exp:</span><span class="tt-val">${fmtFixed(d.life_expectancy_years, 1)} yrs</span></div>
        <div class="tt-row"><span>GDP/capita:</span><span class="tt-val">$${fmt(d.gdp_per_capita_usd)}</span></div>
        <div class="tt-row"><span>Health Exp:</span><span class="tt-val">${fmtFixed(d.perc_health_expenditure_of_gdp, 1, '%')}</span></div>
        <div class="tt-row"><span>Region:</span><span class="tt-val">${d.region || 'N/A'}</span></div>`);
    })
    .on('mousemove', moveTip)
    .on('mouseout', hideTip)
    .on('click', (event, d) => {
      if (selectedCountryCodes.has(d.country_code)) selectedCountryCodes.delete(d.country_code);
      else selectedCountryCodes.add(d.country_code);
      drawAll();
    });

  const legendEl = document.getElementById('bubble-legend');
  legendEl.innerHTML = '';
  if (colorMode === 'is_conflict') {
    legendEl.innerHTML = `
      <div class="legend-item"><div class="legend-dot" style="background:var(--stable)"></div>Stable</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--conflict)"></div>Conflict-affected</div>`;
  } else {
    Object.entries(REGION_COLORS).filter(([k]) => k !== 'Other').forEach(([region, color]) => {
      const div = document.createElement('div');
      div.className = 'legend-item';
      div.innerHTML = `<div class="legend-dot" style="background:${color}"></div>${region}`;
      legendEl.appendChild(div);
    });
  }

  // =====================================================
  // TRAILS (WITH TOGGLE SUPPORT)
  // =====================================================
  const showTrails = document.getElementById('toggle-trails')?.checked;

  if (selectedCountryCodes.size > 0 && showTrails) {
    selectedCountryCodes.forEach(code => {
      const history = getCountryHistory(code)
        .filter(d => d[xKey] > 0 && d.life_expectancy_years > 0);

      if (history.length < 2) return;

      const countryRegion = history[0]?.region;         
      const trailColor = REGION_COLORS[countryRegion] || '#8b949e';

      const trailLine = d3.line()
        .x(d => xScale(d[xKey]))
        .y(d => yScale(d.life_expectancy_years))
        .curve(d3.curveMonotoneX);

      const path = g.append('path')
        .datum(history)
        .attr('fill', 'none')
        .attr('stroke', trailColor)   
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.5)
        .attr('d', trailLine);

      const totalLength = path.node().getTotalLength();

      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    });
  }
}

// =====================================================
// PARALLEL COORDINATES
// =====================================================
function drawParallelCoords() {
  const svg = d3.select('#parallel-svg');
  svg.selectAll('*').remove();

  const container = document.getElementById('parallel-svg')?.closest('.card');
  if (!container) return;

  const W = container.clientWidth - 40;
  const H = 320;
  svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);

  // We set a Minimum number of countries that must have health expenditure data
  // before we show that axis. Below this threshold we drop it gracefully.
  const MIN_HEALTH_COVERAGE = 30;

  const yearData = getYearData(currentYear)
    .filter(d => d.gdp_per_capita_usd > 0 && d.life_expectancy_years > 0);

  if (!yearData.length) return;

  const healthCount = yearData.filter(d => d.perc_health_expenditure_of_gdp > 0).length;
  const showHealth = healthCount >= MIN_HEALTH_COVERAGE;

  const dimensions = showHealth
    ? ['gdp_per_capita_usd', 'perc_health_expenditure_of_gdp', 'life_expectancy_years']
    : ['gdp_per_capita_usd', 'life_expectancy_years'];

  const labels = {
    gdp_per_capita_usd:             'GDP per Capita (USD)',
    perc_health_expenditure_of_gdp: 'Health Exp (% GDP)',
    life_expectancy_years:          'Life Expectancy (yrs)'
  };

  const data = yearData.filter(d =>
    dimensions.every(dim => d[dim] != null && d[dim] > 0)
  );
  if (!data.length) return;

  const iw = W - MARGIN.left - MARGIN.right;
  const ih = H - MARGIN.top - MARGIN.bottom;
  const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const xScale = d3.scalePoint()
    .domain(dimensions)
    .range([0, iw])
    .padding(0.5);

  const yScales = {};
  dimensions.forEach(dim => {
    const validVals = allData
      .map(d => d[dim])
      .filter(v => v != null && v > 0);
    yScales[dim] = d3.scaleLinear()
      .domain(d3.extent(validVals))
      .range([ih, 0])
      .nice();
  });

  function makePath(d) {
    return d3.line()(
      dimensions.map(dim => [xScale(dim), yScales[dim](d[dim])])
    );
  }

  // =====================================================
  // DRAW LINES
  // =====================================================
  const lines = g.selectAll('.pc-line')
    .data(data, d => d.country_code)
    .join('path')
    .attr('class', d =>
      `pc-line ${selectedCountryCodes.has(d.country_code) ? 'pc-selected' : ''}`
    )
    .attr('fill', 'none')
    .attr('stroke', d =>
      selectedCountryCodes.size === 0
        ? (REGION_COLORS[d.region] || '#8b949e')
        : (selectedCountryCodes.has(d.country_code) ? '#ffffff' : '#444')
    )
    .attr('stroke-width', d =>
      selectedCountryCodes.has(d.country_code) ? 2.5 : 1
    )
    .attr('opacity', d =>
      selectedCountryCodes.size === 0
        ? 0.6
        : (selectedCountryCodes.has(d.country_code) ? 1 : 0.1)
    )
    .attr('d', makePath)
    .attr('stroke-dasharray', function() { return this.getTotalLength(); })
    .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
    .transition().duration(600).ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0);

  // =====================================================
  // INTERACTIONS
  // =====================================================
  g.selectAll('.pc-line')
    .on('mouseover', function(event, d) {
      d3.select(this).raise().attr('stroke-width', 3.5).attr('opacity', 1);
      showTip(event, `
        <strong>${d.country_name}</strong>
        <div class="tt-row"><span>Life Exp:</span><span class="tt-val">${fmtFixed(d.life_expectancy_years, 1)} yrs</span></div>
        <div class="tt-row"><span>GDP:</span><span class="tt-val">$${fmt(d.gdp_per_capita_usd)}</span></div>
        ${showHealth ? `<div class="tt-row"><span>Health:</span><span class="tt-val">${fmtFixed(d.perc_health_expenditure_of_gdp, 1, '%')}</span></div>` : ''}
      `);
    })
    .on('mousemove', moveTip)
    .on('mouseout', function(event, d) {
      hideTip();
      d3.select(this)
        .attr('stroke-width', selectedCountryCodes.has(d.country_code) ? 2.5 : 1)
        .attr('opacity', selectedCountryCodes.size === 0 ? 0.6
          : (selectedCountryCodes.has(d.country_code) ? 1 : 0.1));
    })
    .on('click', (event, d) => {
      if (selectedCountryCodes.has(d.country_code)) selectedCountryCodes.delete(d.country_code);
      else selectedCountryCodes.add(d.country_code);
      drawAll();
    });

  // =====================================================
  // AXES
  // =====================================================
  const dimGroup = g.selectAll('.dimension')
    .data(dimensions)
    .join('g')
    .attr('class', 'dimension')
    .attr('transform', d => `translate(${xScale(d)})`);

  dimGroup.each(function(dim) {
    d3.select(this).call(d3.axisLeft(yScales[dim]).ticks(5));
  });

  dimGroup.append('text')
    .attr('class', 'axis-label')
    .attr('y', -12)
    .attr('text-anchor', 'middle')
    .style('fill', 'var(--text-muted)')
    .style('font-size', '11px')
    .text(d => labels[d]);

  // Error Handling Notice when health axis is hidden
  if (!showHealth) {
    svg.append('text')
      .attr('x', W / 2)
      .attr('y', H - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-muted)')
      .attr('font-size', '10px')
      .text('Health expenditure data unavailable before ~2000. Showing GDP & Life Expectancy only');
  }

  // =====================================================
  // BRUSHING
  // =====================================================
  const brushes = {};

  function onBrush() {
    const actives = [];
    dimGroup.each(function(dim) {
      const sel = d3.brushSelection(brushes[dim]);
      if (sel) {
        actives.push({ dim, extent: sel.map(yScales[dim].invert) });
      }
    });
    if (!actives.length) {
      g.selectAll('.pc-line').attr('opacity', 0.6);
      return;
    }
    const filtered = data.filter(d =>
      actives.every(a => {
        const val = d[a.dim];
        return val >= Math.min(...a.extent) && val <= Math.max(...a.extent);
      })
    );
    selectedCountryCodes = new Set(filtered.map(d => d.country_code));
    drawAll();
  }

  dimGroup.append('g')
    .attr('class', 'brush')
    .each(function(dim) {
      brushes[dim] = this;
      d3.select(this).call(
        d3.brushY()
          .extent([[-8, 0], [8, ih]])
          .on('brush end', onBrush)
      );
    });
}

// =====================================================
// MAP
// =====================================================
function drawMap() {
  if (!worldGeo) {
    mapRenderCache = null;
    return;
  }
  hideTip();
  const svg = d3.select('#map-svg');
  svg.selectAll('*').remove();

  const container = document.getElementById('map-svg').closest('.card');
  const W = container.clientWidth - 40;
  const H = 280;
  svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);

  const data = getYearData(currentYear);
  const byCountryCode = new Map(data.map((d) => [d.country_code, d]));

  const countries = topojson.feature(worldGeo, worldGeo.objects.countries);
  const countryFeatures = countries.features.slice().sort((a, b) => d3.geoArea(a) - d3.geoArea(b));

  const proj = d3.geoNaturalEarth1()
    .fitSize([W, H], countries);
  const path = d3.geoPath().projection(proj);

  const lifeVals = data.map((d) => d.life_expectancy_years).filter((v) => v != null && !isNaN(v));
  const lo = lifeVals.length ? d3.min(lifeVals) : 50;
  const hi = lifeVals.length ? d3.max(lifeVals) : 85;
  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([lo, hi]);

  const g = svg.append('g');

  if (!mapPointerLeaveHooked) {
    mapPointerLeaveHooked = true;
    document.getElementById('map-svg').addEventListener('pointerleave', () => {
      clearMapCountryHoverStyles();
    });
  }

  g.selectAll('.country-path').data(countryFeatures)
    .join('path')
    .attr('class', 'country-path')
    .attr('d', path)
    .attr('fill', (feat) => {
      const countryCode = getCountryCodeFromAtlasTopoId(feat.id);
      const d = countryCode ? byCountryCode.get(countryCode) : null;
      if (!d || d.life_expectancy_years == null || isNaN(d.life_expectancy_years)) return '#2d333b';
      return selectedCountryCodes.size > 0
        ? (selectedCountryCodes.has(d.country_code) ? colorScale(d.life_expectancy_years) : '#2d333b')
        : colorScale(d.life_expectancy_years);
    })
    .attr('stroke', '#3d4451')
    .attr('stroke-width', 0.3)
    .attr('opacity', (feat) => {
      const countryCode = getCountryCodeFromAtlasTopoId(feat.id);
      const d = countryCode ? byCountryCode.get(countryCode) : null;
      return d ? 1 : 0.4;
    })
    .on('mouseover', (event, feat) => {
      const countryCode = getCountryCodeFromAtlasTopoId(feat.id);
      const d = countryCode ? byCountryCode.get(countryCode) : null;
      mapHoveredTopoId = feat.id;
      updateMapOutlineLayer();
      const name = d?.country_name ?? feat.properties?.name ?? (countryCode ? `(${countryCode})` : 'Unknown');
      showTip(event, `<strong>${name}</strong>
        <div class="tt-row"><span>Life Exp:</span><span class="tt-val">${fmtFixed(d?.life_expectancy_years, 1)} yrs</span></div>
        <div class="tt-row"><span>GDP/capita:</span><span class="tt-val">$${fmt(d?.gdp_per_capita_usd)}</span></div>
        <div class="tt-row"><span>Health Exp:</span><span class="tt-val">${fmtFixed(d?.perc_health_expenditure_of_gdp, 1, '%')}</span></div>
        <div class="tt-row"><span>Region:</span><span class="tt-val">${d?.region || 'N/A'}</span></div>`);
    })
    .on('mousemove', moveTip)
    .on('mouseout', () => {
      hideTip();
      mapHoveredTopoId = null;
      updateMapOutlineLayer();
    })
    .on('click', (event, feat) => {
      const countryCode = getCountryCodeFromAtlasTopoId(feat.id);
      if (!countryCode) return;
      if (selectedCountryCodes.has(countryCode)) selectedCountryCodes.delete(countryCode);
      else selectedCountryCodes.add(countryCode);
      drawAll();
    });

  mapRenderCache = { g, countryFeatures, path };
  updateMapOutlineLayer();

  const legSvg = d3.select('#map-legend-svg');
  legSvg.selectAll('*').remove();
  const defs = legSvg.append('defs');
  const grad = defs.append('linearGradient').attr('id', 'map-grad');
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    grad.append('stop')
      .attr('offset', `${i * 100 / steps}%`)
      .attr('stop-color', colorScale(lo + (hi - lo) * i / steps));
  }
  legSvg.append('rect').attr('width', 180).attr('height', 10).attr('fill', 'url(#map-grad)').attr('rx', 3);
}

// =====================================================
// BOX PLOT
// =====================================================
function drawBoxplot() {
  const svg = d3.select('#boxplot-svg');
  svg.selectAll('*').remove();

  const container = document.getElementById('boxplot-svg').closest('.card');
  const W = container.clientWidth - 40;
  const H = 260;
  svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);

  const data = getYearData(currentYear);
  const conflictData = data.filter((d) => d.is_conflict).map((d) => d.life_expectancy_years).filter((v) => v != null && !isNaN(v));
  const stableData = data.filter((d) => !d.is_conflict).map((d) => d.life_expectancy_years).filter((v) => v != null && !isNaN(v));

  const iw = W - MARGIN.left - MARGIN.right;
  const ih = H - MARGIN.top - MARGIN.bottom;
  const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const allVals = [...conflictData, ...stableData];
  if (!allVals.length) return;

  const yScale = d3.scaleLinear()
    .domain([d3.min(allVals) - 2, d3.max(allVals) + 2])
    .range([ih, 0]).nice();

  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(yScale).tickSize(-iw).tickFormat(''));
  g.append('g').attr('class', 'axis').call(d3.axisLeft(yScale).ticks(6));
  g.append('text').attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)').attr('x', -ih / 2).attr('y', -42).attr('text-anchor', 'middle')
    .text('Life Expectancy (years)');

  const xScale = d3.scaleBand()
    .domain(['Conflict', 'Stable'])
    .range([0, iw]).padding(0.5);

  g.append('g').attr('class', 'axis').attr('transform', `translate(0,${ih})`)
    .call(d3.axisBottom(xScale));

  function boxStats(vals) {
    const sorted = vals.slice().sort(d3.ascending);
    return {
      q1: d3.quantile(sorted, 0.25),
      median: d3.quantile(sorted, 0.5),
      q3: d3.quantile(sorted, 0.75),
      min: d3.min(sorted),
      max: d3.max(sorted),
      mean: d3.mean(sorted)
    };
  }

  function drawBox(vals, label, color) {
    if (!vals.length) return;
    const s = boxStats(vals);
    const cx = xScale(label) + xScale.bandwidth() / 2;
    const bw = xScale.bandwidth();

    g.append('line')
      .attr('x1', cx).attr('x2', cx).attr('y1', yScale(s.min)).attr('y2', yScale(s.q1))
      .attr('stroke', color).attr('stroke-width', 1.5).attr('stroke-dasharray', '3,2');
    g.append('line')
      .attr('x1', cx).attr('x2', cx).attr('y1', yScale(s.q3)).attr('y2', yScale(s.max))
      .attr('stroke', color).attr('stroke-width', 1.5).attr('stroke-dasharray', '3,2');
    [s.min, s.max].forEach((v) => {
      g.append('line')
        .attr('x1', cx - bw * 0.2).attr('x2', cx + bw * 0.2).attr('y1', yScale(v)).attr('y2', yScale(v))
        .attr('stroke', color).attr('stroke-width', 1.5);
    });
    g.append('rect')
      .attr('x', cx - bw / 2).attr('y', yScale(s.q3))
      .attr('width', bw).attr('height', yScale(s.q1) - yScale(s.q3))
      .attr('fill', color).attr('fill-opacity', 0.2).attr('stroke', color).attr('stroke-width', 2)
      .attr('rx', 3);
    g.append('line')
      .attr('x1', cx - bw / 2).attr('x2', cx + bw / 2).attr('y1', yScale(s.median)).attr('y2', yScale(s.median))
      .attr('stroke', color).attr('stroke-width', 2.5);
    g.append('circle')
      .attr('cx', cx).attr('cy', yScale(s.mean))
      .attr('r', 4).attr('fill', '#fff').attr('stroke', color).attr('stroke-width', 1.5);
    g.append('text').attr('x', cx + bw / 2 + 4).attr('y', yScale(s.median) + 4)
      .attr('fill', color).attr('font-size', '10px')
      .text(`Med: ${s.median.toFixed(1)}`);

    const jitter = vals.map((v) => ({ v, jx: (Math.random() - 0.5) * bw * 0.4 }));
    g.selectAll(`.dot-${label}`).data(jitter)
      .join('circle').attr('class', `dot-${label}`)
      .attr('cx', (d) => cx + d.jx).attr('cy', (d) => yScale(d.v))
      .attr('r', 2).attr('fill', color).attr('fill-opacity', 0.4);
  }

  drawBox(conflictData, 'Conflict', 'var(--conflict)');
  drawBox(stableData, 'Stable', 'var(--stable)');

  const cs = boxStats(conflictData.length ? conflictData : [0]);
  const ss = boxStats(stableData.length ? stableData : [0]);
  if (conflictData.length && stableData.length) {
    const diff = (ss.median - cs.median).toFixed(1);
    g.append('text').attr('x', iw).attr('y', 12).attr('text-anchor', 'end')
      .attr('fill', 'var(--text-muted)').attr('font-size', '10px')
      .text(`Gap: ${diff} years`);
  }
}

// =====================================================
// LINE CHART
// =====================================================
function drawLineChart() {
  const svg = d3.select('#linechart-svg');
  svg.selectAll('*').remove();

  const container = document.getElementById('linechart-svg').closest('.card');
  const W = container.clientWidth - 40;
  const H = 260;
  svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);

  const iw = W - MARGIN.left - MARGIN.right;
  const ih = H - MARGIN.top - MARGIN.bottom;
  const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const years = d3.range(yearMin, yearMax + 1);

  let seriesData;
  const legendEl = document.getElementById('line-legend');
  legendEl.innerHTML = '';

  if (selectedCountryCodes.size > 0) {
    seriesData = Array.from(selectedCountryCodes).map((code) => {
      const rows = allData.filter((d) => d.country_code === code).sort((a, b) => a.year - b.year);
      return { key: code, name: rows[0]?.country_name || code, values: rows };
    }).filter((s) => s.values.length > 0);

    seriesData.forEach((s, i) => {
      const color = Object.values(REGION_COLORS)[i % 8];
      const div = document.createElement('div');
      div.className = 'legend-item';
      div.innerHTML = `<div class="legend-line" style="background:${color}"></div>${s.name}`;
      legendEl.appendChild(div);
      s.color = color;
    });
  } else {
    const regions = Object.keys(REGION_COLORS).filter((r) => r !== 'Other');
    seriesData = regions.map((region, i) => {
      const values = years.map((yr) => {
        const yrData = allData.filter((d) => d.year === yr && d.region === region);
        const avg = d3.mean(yrData, (d) => d.life_expectancy_years);
        return { year: yr, life_expectancy_years: avg };
      }).filter((d) => d.life_expectancy_years != null && !isNaN(d.life_expectancy_years));
      return { key: region, name: region, values, color: Object.values(REGION_COLORS)[i] };
    });

    seriesData.forEach((s) => {
      const div = document.createElement('div');
      div.className = 'legend-item';
      div.innerHTML = `<div class="legend-line" style="background:${s.color}"></div>${s.name}`;
      legendEl.appendChild(div);
    });
  }

  const allVals = seriesData.flatMap((s) => s.values.map((d) => d.life_expectancy_years)).filter(Boolean);
  if (!allVals.length) return;

  const xScale = d3.scaleLinear().domain([yearMin, yearMax]).range([0, iw]);
  const yScale = d3.scaleLinear()
    .domain([d3.min(allVals) - 1, d3.max(allVals) + 1]).range([ih, 0]).nice();

  g.append('g').attr('class', 'grid').call(d3.axisLeft(yScale).tickSize(-iw).tickFormat(''));
  g.append('g').attr('class', 'axis').attr('transform', `translate(0,${ih})`)
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format('d')));
  g.append('g').attr('class', 'axis').call(d3.axisLeft(yScale).ticks(6));

  g.append('text').attr('class', 'axis-label')
    .attr('x', iw / 2).attr('y', ih + 38).attr('text-anchor', 'middle').text('Year');
  g.append('text').attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)').attr('x', -ih / 2).attr('y', -42).attr('text-anchor', 'middle')
    .text('Life Expectancy (years)');

  const line = d3.line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.life_expectancy_years))
    .curve(d3.curveMonotoneX)
    .defined((d) => d.life_expectancy_years != null && !isNaN(d.life_expectancy_years));

  seriesData.forEach((s) => {
    const path = g.append('path')
      .datum(s.values)
      .attr('fill', 'none')
      .attr('stroke', s.color)
      .attr('stroke-width', selectedCountryCodes.size > 0 ? 2.5 : 1.8)
      .attr('d', line)
      .attr('opacity', 0.85);

    const totalLen = path.node().getTotalLength();
    path.attr('stroke-dasharray', `${totalLen} ${totalLen}`)
      .attr('stroke-dashoffset', totalLen)
      .transition().duration(800).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
  });

  g.append('line')
    .attr('x1', xScale(currentYear)).attr('x2', xScale(currentYear))
    .attr('y1', 0).attr('y2', ih)
    .attr('stroke', '#fff').attr('stroke-width', 1).attr('stroke-dasharray', '4,3')
    .attr('opacity', 0.4);
}

// =====================================================
// STATS
// =====================================================
function updateStats() {
  const data = getSelectedData(currentYear);
  const prevData = getSelectedData(currentYear - 1);

  let label = 'Global Overview';
  if (selectedCountryCodes.size === 1) {
    const code = Array.from(selectedCountryCodes)[0];
    const row = getYearData(currentYear).find((d) => d.country_code === code);
    label = row?.country_name || code;
  } else if (selectedCountryCodes.size > 1) {
    label = `${selectedCountryCodes.size} Countries Selected`;
  }
  const labelEl = document.querySelector('#selected-label strong');
  if (labelEl) labelEl.textContent = label;

  function setstat(id, deltaId, key, prefix = '', suffix = '', digits = 1) {
    const val = mean(data, key);
    const prev = mean(prevData, key);
    const el = document.getElementById(id);
    const delEl = document.getElementById(deltaId);
    if (!el || !delEl) return;

    el.textContent = val != null ? prefix + fmt(val, digits) + suffix : 'N/A';
    if (val != null && prev != null) {
      const diff = val - prev;
      const sign = diff >= 0 ? '+' : '';
      const cls = diff >= 0 ? 'delta-up' : 'delta-down';
      const arrow = diff >= 0 ? '\u25B2' : '\u25BC';
      delEl.innerHTML =
        `<span class="${cls}">${arrow} ${sign}${Math.abs(diff).toFixed(1)}${suffix} vs ${currentYear - 1}</span>`;
    } else {
      delEl.innerHTML = '';
    }
  }

  setstat('stat-gdp', 'delta-gdp', 'gdp_per_capita_usd', '$', '', 0);
  setstat('stat-health', 'delta-health', 'perc_health_expenditure_of_gdp', '', '%', 1);
  setstat('stat-life', 'delta-life', 'life_expectancy_years', '', '', 1);

  const countEl = document.getElementById('stat-count');
  const dCountEl = document.getElementById('delta-count');
  if (countEl) countEl.textContent = data.length;
  if (dCountEl) {
    dCountEl.textContent =
      selectedCountryCodes.size === 0 ? 'All countries' : 'Selected';
  }
}

// =====================================================
// RANKING TABLE
// =====================================================
function drawRanking() {
  const data = getYearData(currentYear);
  const groupKey = document.getElementById('rank-group-select').value;

  const finiteLife = (d) => d.life_expectancy_years != null && !isNaN(d.life_expectancy_years);

  let ranked;
  if (selectedCountryCodes.size > 0) {
    ranked = data.filter((d) => selectedCountryCodes.has(d.country_code))
      .filter(finiteLife)
      .sort((a, b) => b.life_expectancy_years - a.life_expectancy_years)
      .slice(0, 20);
  } else {
    ranked = data
      .filter((d) => d[groupKey] && d[groupKey] !== 'Other')
      .filter(finiteLife)
      .sort((a, b) => b.life_expectancy_years - a.life_expectancy_years)
      .slice(0, 20);
  }

  const tbody = document.getElementById('ranking-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  ranked.forEach((d, i) => {
    const tr = document.createElement('tr');
    const isSelected = selectedCountryCodes.has(d.country_code);
    tr.innerHTML = `
      <td class="rank-num">${i + 1}</td>
      <td class="${isSelected ? 'rank-highlight' : ''}">${d.country_name}</td>
      <td>${fmtFixed(d.perc_health_expenditure_of_gdp, 1, '%')}</td>
      <td>${fmtFixed(d.life_expectancy_years, 1)} yrs</td>
      <td>$${fmt(d.gdp_per_capita_usd)}</td>
      <td style="color:var(--text-muted)">${d[groupKey] || 'N/A'}</td>
    `;
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => {
      if (selectedCountryCodes.has(d.country_code)) selectedCountryCodes.delete(d.country_code);
      else selectedCountryCodes.add(d.country_code);
      drawAll();
    });
    tbody.appendChild(tr);
  });
}

// =====================================================
// RESIZE HANDLER
// =====================================================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawAll, 200);
});

// =====================================================
// START
// =====================================================
init();

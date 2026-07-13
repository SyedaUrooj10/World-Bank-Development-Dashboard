# Exploring the Drivers of Longevity

**Source Repository:** [GitLab Link](https://gitlab-student.macs.hw.ac.uk/sb4057/f-21-dv-gp-dubai-2)

## F21DV Group Project (Group Number: 2) – Data Visualisation and Analytics 2025–2026

An interactive data story exploring how GDP, healthcare spending, and conflict shape life expectancy across 200+ countries from 1960 to 2023, using World Bank development indicators.

---

## Project Structure

```bash
├── index.html                 # Entry point (dashboard layout + containers)

├── scripts/
│   ├── main.js                # Core D3 visualisations + interactions
│   └── eda.ipynb              # Exploratory data analysis (development only)

├── styles/
│   └── main.css               # Dashboard styling + guided tour UI

├── data/
│   ├── clean/
│   │   └── merged_df.csv      # Final processed dataset used in app
│   │
│   └── raw/
│       ├── countries-50m.json
│       ├── country-codes.csv
│       └── ... (World Bank source datasets)

├── libs/
│   └── d3/
│       └── d3.v7.min.js       # D3 library (local)

├── img/                       # Documentation / README assets

├── README-Default.md
└── README.md
```

---

## How to Run

1. **Clone the repository**

```bash
git clone git@gitlab-student.macs.hw.ac.uk:sb4057/f-21-dv-gp-dubai-2.git
```

2. **Run a local server** (required for D3 data loading):

```bash
python3 -m http.server 8000
```

3. Open in browser:

```
http://localhost:8000
```

Or use VS Code Live Server or any static file server.

---

## Datasets

### Core indicators (World Bank)

| Indicator (human-readable)              | API code           | Source               | Licence   |
| --------------------------------------- | ------------------ | -------------------- | --------- |
| Life expectancy at birth, total (years) | `SP.DYN.LE00.IN`   | World Bank Open Data | CC BY 4.0 |
| GDP per capita (current US$)            | `NY.GDP.PCAP.CD`   | World Bank Open Data | CC BY 4.0 |
| Current health expenditure (% of GDP) | `SH.XPD.CHEX.GD.ZS`| World Bank Open Data | CC BY 4.0 |

Downloads use the standard World Bank “API CSV” layout (wide format: countries as rows, calendar years as columns, four metadata rows before the header).

### Conflict / fragility flags

| Dataset | Source | Notes |
| ------- | ------ | ----- |
| `data/raw/ConflictCountries/conflict_countries.csv` | Derived from the World Bank Fragile and Conflict-affected Situations (FCS) list | Manually compiled country–year pairs (`year`, `country_name`) joined to the development panel. |

### Geospatial and code joins (chloropleth only)

| File | Role |
| ---- | ---- |
| `data/raw/countries-50m.json` | World Atlas / Natural Earth topology for the choropleth (`feat.id` = ISO 3166-1 numeric). |
| `data/raw/country-codes.csv` | Maps numeric ISO codes to ISO 3166-1 alpha-3 codes used in `merged_df.csv`. |

### Temporal coverage

- The merged file keeps the year range present in the World Bank extracts (from 1960 onward, depending on the series).
- Health spending is sparse in early decades; the EDA and the app treat that as is.
- The interactive story caps the displayed timeline at 2023 so views stay comparable while newer source years may still be incomplete.

---

## Data cleanup

- World Bank downloads are wide (years as columns) which have been reshaped into one row per country and year.
- GDP, life expectancy, health spending, and the conflict list are joined on a common country–year key.
- Region, income group, and a flag for World Bank aggregate regions (world/regional rows, not individual countries) come from metadata; aggregates remain in the exported CSV but are filtered out in the app for country-level charts.
- Output: `data/clean/merged_df.csv`, built in `scripts/eda.ipynb`.
- The front end normalises missing values, applies the same aggregate filter, and limits the timeline to 2023.

---

## Visualisations

### 1. Bubble Chart (top-right)

**Purpose:** Shows the relationship between GDP/health expenditure and life expectancy.

**Controls:**

* **X Axis** — GDP per Capita or Health Expenditure
* **Color** — Conflict status or Region
* **Size** — Income group or Health Expenditure

**Interaction:** Click bubbles to select countries and update all charts.

**Enhancements Added:**

* Movement trails showing historical trajectories
* Smooth animation using `stroke-dasharray`
* Toggle control for trails
* Improved log scale readability using powers-of-10 labels

---

### 2. Choropleth Map (top-left)

**Purpose:** Geographic distribution of life expectancy.

**Interaction:** Click countries to select/deselect and filter all charts.

---

### 3. MULTI-FACTOR ANALYSIS

**Purpose:** Multi-factor analysis across GDP, health expenditure, and life expectancy.

**Features:**

* Animated line rendering
* Hover tooltips and click selection
* Brushing for filtering

**Adaptive Handling:**

* Automatically hides health axis when data is insufficient

```js
const MIN_HEALTH_COVERAGE = 30;
```

---

### 4. Box Plot (bottom-left)

**Purpose:** Comparison between conflict and non-conflict countries.

Shows quartiles, median, distribution spread, and jitter points.

---

### 5. Line Chart (bottom-right)

**Purpose:** Temporal trends in life expectancy.

* Default: Regional averages
* Selected countries: Individual trajectories
* Animated transitions and current-year indicator

---

## Interactions

| Interaction     | Effect                     |
| --------------- | -------------------------- |
| Year Slider     | Updates all visualisations |
| Play Button     | Animates timeline          |
| Map Click       | Select/deselect countries  |
| Bubble Click    | Same as map                |
| Trails Toggle   | Shows movement history     |
| Parallel Brush  | Filters countries          |
| Ranking Table   | Select countries           |
| Guided Tour     | Explains full narrative    |
| Clear Selection | Reset view                 |

**Bidirectional linking:** Map ↔ Bubble ↔ Ranking ↔ Parallel Coordinates

---

## Key Features

### Guided Tour (Narrative System)

* Overlay-based onboarding
* Step-by-step storytelling
* DOM-targeted highlighting
* Progress indicators and navigation
* Auto-trigger on first load

### Bubble Chart Enhancements

* Historical movement trails
* Smooth animated transitions
* Log scale readability improvements

### Parallel Coordinates

* Multi-dimensional comparison
* Brushing and filtering
* Interactive highlighting

### UI/UX Improvements

* Dynamic tour positioning
* Informational tooltips
* Chart captions
* Improved onboarding

### Target Audience Integration

* Policy makers
* Researchers / journalists
* Students

---

## Design Decisions

- **Dark theme** for data-dense dashboards — reduces eye strain and improves contrast for coloured data marks
- Narrative-first design using **guided storytelling**
- **Log scale** on GDP axis — compresses the extreme range (~$200 to ~$80,000) into a readable space
- Log scale adapted for readability
- **Conflict classification** based on UCDP/ACLED data (countries with ongoing armed conflict post-2000)
- **Regional aggregates excluded** from country-level charts (World Bank aggregate codes like `AFE`, `WLD`, etc.)
- **Multi-view** coordinated interactions
- **Year slider sticky** at top so the primary filter control is always visible

---

## Code Architecture

| Component            | Location | Description            |
| -------------------- | -------- | ---------------------- |
| init()               | main.js  | Data loading and setup |
| drawAll()            | main.js  | Re-render controller   |
| drawBubble()         | main.js  | Bubble chart + trails  |
| drawMap()            | main.js  | Choropleth map         |
| drawBoxplot()        | main.js  | Distribution analysis  |
| drawLineChart()      | main.js  | Time-series trends     |
| drawParallelCoords() | main.js  | Multi-factor analysis  |
| startTour()          | main.js  | Guided tour init       |
| renderTourStep()     | main.js  | Step rendering         |

**State variables:**

* currentYear
* selectedCountryCodes

---

## Challenges & Solutions

### 1. Log Scale Label Clutter

* Problem: Overlapping labels
* Solution: Static powers-of-10 labels

### 2. Missing Health Data

* Problem: Data unavailable pre-2000
* Solution: Adaptive axis removal

### 3. Guided Tour Overlap

* Problem: UI overlap issues
* Solution: Dynamic positioning

### 4. Trail Animation

* Problem: Smooth historical rendering
* Solution: stroke-dashoffset animation

### 5. Multi-Dimensional Complexity

* Problem: Visualising multiple variables
* Solution: Parallel coordinates with brushing

---

## Libraries Used

| Library     | Version |
| ----------- | ------- |
| D3.js       | 7.x     |
| TopoJSON    | 3.x     |
| World Atlas | 2       |

---

## Target Audience

Policy analysts, public health researchers, journalists, and students interested in global health inequality and longevity drivers.

---
"# World-Bank-Development-Dashboard" 

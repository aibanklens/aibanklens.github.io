# Content Editing Guide

This guide explains **where and how** to edit every piece of content in the site — no coding knowledge required beyond basic text editing.

---

## Quick Reference

| What to change | File to edit |
|:---------------|:-------------|
| Bank names, colors, short names | `types/index.ts` → `BANK_META` |
| Risk scores (annual data) | `public/data/annual_summary.json` |
| Per-category risk scores | `public/data/bank_risk_detail.json` |
| OSFI risk category definitions | `public/data/osfi_taxonomy.json` |
| Evidence / source quotes | `public/data/evidence_log.json` |
| AI milestone timeline events | `app/bank/[slug]/page.tsx` → `MILESTONES` |
| Page titles, nav labels | `app/layout.tsx`, individual `page.tsx` files |
| Colors, fonts, spacing | `app/globals.css` |
| GitHub Pages sub-path | `next.config.js` |

---

## 1. Risk Scores — `public/data/annual_summary.json`

This is the **main data file** for the dashboard. Each entry represents one bank × one year.

### File structure (one row per bank per year):
```json
{
  "Bank": "BMO",
  "Year": 2025,
  "Average_internal_risk": 3.87,
  "Average_external_risk": 3.23,
  "Average_overall_risk": 3.66,
  "Annual_AI_summary": "2025 marks enterprise AI scaling...",
  "Source_refs": "bmo_ar2025.pdf; BMO_AI_News_Releases.docx"
}
```

### How to update:
- Change `Average_internal_risk`, `Average_external_risk`, `Average_overall_risk` to update chart values.
- Edit `Annual_AI_summary` to update the text shown on each bank's card and detail page.
- Add new years by appending new rows (keep the same structure).

### Risk colour thresholds (automatic):
- **≥ 3.5** → Red (Very High)
- **≥ 3.0** → Yellow (High)
- **< 3.0** → Green (Moderate/Low)

---

## 2. Per-Category Scores — `public/data/bank_risk_detail.json`

This feeds the **heatmap** and **risk radar** charts. Each row is one bank × year × risk category.

### Key fields:
```json
{
  "Bank": "TD",
  "Year": 2025,
  "Category_ID": "INT1",
  "Risk_category": "Data governance, privacy and data quality risk",
  "Exposure_1_score": 4,
  "Exposure_2_score": 4,
  "Control_score": 3,
  "Raw_exposure": 4.0,
  "Final_risk_estimate": 4.0,
  "Category_summary": "Short description shown in tooltip..."
}
```

### How to update:
- Change `Exposure_1_score`, `Exposure_2_score`, `Control_score` (all 1–5).
- The formula is: `Final_risk = avg(Exp1, Exp2) - 0.25 × (Control - 3)`.  
  **You can just directly set `Final_risk_estimate` if you prefer.**
- Edit `Category_summary` to update the tooltip text on the heatmap.

---

## 3. OSFI Category Definitions — `public/data/osfi_taxonomy.json`

Defines the 9 risk categories shown in the legend and methodology page.

```json
{
  "Category_ID": "INT1",
  "OSFI_bucket": "Internal",
  "Risk_category": "Data governance, privacy and data quality risk",
  "Exposure_1_name": "Sensitive data use",
  "Exposure_2_name": "External data processing complexity",
  "Control_name": "Data governance visibility"
}
```

Edit `Risk_category`, `Exposure_1_name`, etc. to change labels shown in the UI.

---

## 4. AI Milestone Timeline — `app/bank/[slug]/page.tsx`

Look for the `MILESTONES` constant near the top of the file (around line 10). It is a plain JavaScript object — one key per bank.

### Structure:
```typescript
const MILESTONES = {
  BMO: [
    {
      year: 2025,
      category: 'award',      // strategy | hire | tech | award | risk
      text: 'First Canadian bank to join IBM Quantum Network...',
      source: 'BMO Newsroom 2025',
    },
    // Add more events here...
  ],
  TD: [ ... ],
  // etc.
};
```

### Categories and their colours:
| Key | Label | Colour |
|:----|:------|:-------|
| `strategy` | Strategy | Blue |
| `hire` | Leadership | Green |
| `tech` | Technology | Yellow |
| `award` | Award | Purple |
| `risk` | Risk | Red |

### To add a new event:
```typescript
{ year: 2026, category: 'tech', text: 'Description here.', source: 'Source name' },
```

---

## 5. Bank Identity — `types/index.ts`

Controls short names, full names, and brand colours shown throughout the site.

```typescript
export const BANK_META = {
  'BMO': {
    color:     '#0066CC',      // ← brand hex colour
    shortName: 'BMO',          // ← used in charts and cards
    fullName:  'Bank of Montreal',
  },
  // ...
};
```

**To change a bank's colour**, edit the `color` field.  
**To rename a bank**, edit `shortName` or `fullName`.

---

## 6. Adding a New Year's Data

1. **`public/data/annual_summary.json`** — append 6 rows (one per bank) for the new year.
2. **`public/data/bank_risk_detail.json`** — append 9 rows per bank (one per risk category) for the new year.
3. **`types/index.ts`** — add the new year to the `YEARS` array:
   ```typescript
   export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;
   ```
4. Rebuild and redeploy.

---

## 7. Page Titles & Navigation Labels

| Location | File |
|:---------|:-----|
| Browser tab title | `app/layout.tsx` → `metadata.title` |
| Nav brand name | Every `page.tsx` → `<span className="nav-brand">` |
| Footer text | Every `page.tsx` → `<footer className="footer">` |
| Dashboard headline | `app/page.tsx` → `<h1 className="section-title">` |

---

## 8. Styles & Theme — `app/globals.css`

The entire visual theme is driven by CSS variables at the top of the file:

```css
:root {
  --bg:       #0d1117;   /* page background */
  --surface:  #161b22;   /* card background */
  --surface2: #21262d;   /* secondary surface */
  --border:   #30363d;   /* borders */
  --text:     #e6edf3;   /* primary text */
  --text2:    #8b949e;   /* secondary text */
  --accent:   #58a6ff;   /* links, highlights */
  --green:    #3fb950;
  --red:      #f85149;
  --yellow:   #d29922;
}
```

Change any value here to restyle the entire site instantly.

---

## 9. GitHub Pages Sub-Path Config — `next.config.js`

If your repo is `github.com/username/bank-tracker` (not a root domain), the site will be served at `https://username.github.io/bank-tracker/`.

Uncomment and set:
```js
basePath: '/bank-tracker',
assetPrefix: '/bank-tracker/',
```

Replace `bank-tracker` with your actual repository name.

---

## After Any Edit

```bash
# Preview locally
npm run dev

# Build static files (creates ./out/ folder)
npm run build

# Or just push to GitHub — the Actions workflow deploys automatically
git add .
git commit -m "Update content"
git push
```

# Canada Big-6 AI Risk Tracker

A research-grade interactive dashboard tracking AI & cloud risk across Canada's six largest banks (TD, RBC, Scotiabank, CIBC, BMO, NBC), assessed under the OSFI-FCAC regulatory framework (2020–2025).

**Live site:** `https://<your-username>.github.io/<repo-name>/`

---

## Tech Stack

- **Framework:** Next.js 14 (static export)
- **Charts:** Apache ECharts 5
- **Styling:** Plain CSS variables (dark theme)
- **Data:** JSON files in `public/data/`

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:3456
npm run dev

# Build static export → ./out/
npm run build
```

---

## GitHub Pages Deployment

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source** → set to **GitHub Actions**.
3. The workflow at `.github/workflows/deploy.yml` will build and deploy automatically on every push to `main`.

### If deployed under a sub-path (e.g. `/repo-name/`)

Edit `next.config.js` and uncomment:

```js
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name/',
```

---

## Content Editing Guide

See **[CONTENT_EDITING_GUIDE.md](./CONTENT_EDITING_GUIDE.md)** for full instructions on how to edit every part of the site.

---

## Project Structure

```
bank-ai-risk-site/
├── app/
│   ├── page.tsx              ← Home Dashboard
│   ├── heatmap/page.tsx      ← Risk Heatmap
│   ├── bank/[slug]/page.tsx  ← Individual bank detail (incl. milestones)
│   ├── methodology/page.tsx  ← Methodology explanation
│   ├── globals.css           ← All styles
│   └── layout.tsx            ← Root layout & nav
├── types/index.ts            ← TypeScript types + BANK_META config
├── lib/data.ts               ← Data loading helpers
├── public/
│   └── data/
│       ├── annual_summary.json
│       ├── bank_risk_detail.json
│       ├── osfi_taxonomy.json
│       └── evidence_log.json
├── next.config.js
├── package.json
├── CONTENT_EDITING_GUIDE.md  ← ★ Start here to edit content
└── .github/
    └── workflows/
        └── deploy.yml        ← Auto-deploy to GitHub Pages
```

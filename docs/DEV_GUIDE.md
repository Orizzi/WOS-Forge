# Developer Guide - WOS Calculator

## Project Structure (Simplified)

```
src/
├── index.html + 6 calculator pages  # All HTML
├── Scripts/                         # 20 JS modules
│   ├── calculator.js                # Charms
│   ├── chief-gear-calculator.js     # Chief Gear  
│   ├── fire-crystals-calculator.js  # Buildings
│   ├── war-laboratory.js            # War Academy
│   ├── profiles.js                  # Save/load
│   ├── theme.js                     # Dark/light mode
│   ├── translations.js              # i18n (8 languages)
│   └── data-loader.js               # CSV loading
├── style/style.css                  # All styles (1 file)
└── assets/*.csv                     # Game data

scripts/
└── extract-*.js                     # Excel → CSV tools
```

## Quick Commands

```bash
npm start              # Dev server → http://127.0.0.1:8080
npm run build          # Production build → dist/
npm run lint           # CSS quality check
npm run import:all     # Update CSV from Excel
```

## Common Tasks

### Update Costs
1. Edit `src/assets/resource_data.xlsx`
2. Run `npm run import:charms` (or specific extractor)
3. Refresh browser

### Change Theme
Edit `src/style/style.css`:
```css
:root {
  --accent: #7c6cff;    /* Main color */
  --bg: #12121a;        /* Background */
}
```

### Add Translation
Edit `src/Scripts/translations.js` → Add key to all 8 language objects

## Architecture

**Data Flow**: Excel → CSV → JavaScript → Calculators  
**Pattern**: IIFE modules (no dependencies)  
**Storage**: localStorage (profiles), CSV (game data)  
**Build**: Optional (Terser for production)

## Load Order (Critical)

Independent first:
1. icon-helper.js, theme.js, data-loader.js

Dependent after:
2. calculator.js, profiles.js, translations.js

## Troubleshooting

**Wrong costs shown**: Run `npm run import:all`  
**Profiles don't save**: Check localStorage enabled (not incognito)  
**Layout broken**: Test at actual device widths, not just resize

## File Count

- 7 HTML files
- 20 JavaScript modules
- 1 CSS file
- 10 CSV data files
- ~50 images/icons

**Previously**: 30+ documentation files → **Now**: This file only

## Key Conventions

- All colors use CSS variables (no hardcoded hex)
- Module names preserved during minification
- CSV failures fall back to hardcoded defaults
- Responsive: 480px, 768px, 1024px, 1280px breakpoints

---

**Full details**: See main README.md  
**Roadmap**: See TODO.md

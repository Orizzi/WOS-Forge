# WOS Calculator

> **Whiteout Survival Calculator Suite** - Comprehensive resource planning tools for Whiteout Survival players.

A complete set of calculators for planning resource requirements across multiple Whiteout Survival game systems. Features multi-language support (8 languages), profile management with inventory tracking, and data-driven calculations from authoritative Excel sources.

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](CHANGELOG.md)
[![Languages](https://img.shields.io/badge/languages-8-green.svg)](I18N_SYSTEM.md)
[![License](https://img.shields.io/badge/license-Community-orange.svg)](LICENSE)

---

## 🎮 Features

### Active Calculators
- ✅ **Charms Calculator** - Calculate charm upgrade costs and power gains
- ✅ **Chief Gear Calculator** - Plan gear upgrades across 46 levels with SVS points
- ✅ **Fire Crystals Calculator** - Building refinement costs with time estimates and power calculation
- ✅ **War Academy Calculator** - Helios research tree progression with resource gaps

### Coming Soon
- 🔜 **Experts Calculator** - Expert leveling and resource planning
- 🔜 **Pets Calculator** - Pet upgrade cost tracking

### Core Features
- 🌍 **8 Languages** - EN, ES, KO, RU, FR, DE, PT, IT (193 translation keys per language)
- 💾 **Profile System** - Save/load multiple profiles with inventory tracking
- 📊 **Gap Calculation** - Shows what you need vs. what you have
- ⏱️ **Time Estimates** - Calculate upgrade times for Fire Crystals
- 🎨 **Dark/Light Theme** - Persistent theme preference
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- ♿ **Accessible** - ARIA labels, semantic HTML, keyboard navigation
- 💽 **Data Persistence** - localStorage for profiles and preferences

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ (for development)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Running Locally
```bash
# Clone the repository
git clone https://github.com/Orizzi/WOS-Forge.git
cd WOS-Forge

# Install dependencies
npm install

# Start development server
npm start
# Opens http://localhost:8080
```

### Using the Calculators
1. Open `index.html` in your browser
2. Navigate to your desired calculator
3. Select your language from the dropdown
4. Enter current and target levels
5. Optionally: Load a profile to include your inventory
6. View resource requirements and gaps

---

## 📂 Project Structure

```
WOS-Forge/
├── index.html                      # GitHub Pages entry point
├── package.json                    # npm configuration
├── netlify.toml                    # Netlify deployment config
│
├── src/                            # Application source
│   ├── charms.html                 # Charms calculator page
│   ├── chiefGear.html              # Chief Gear calculator page
│   ├── fireCrystals.html           # Fire Crystals calculator page
│   ├── war-academy.html            # War Academy calculator page
│   ├── experts.html                # Experts calculator (coming soon)
│   ├── pets.html                   # Pets calculator (coming soon)
│   ├── coming-soon.html            # Placeholder page
│   │
│   ├── Scripts/                    # JavaScript modules
│   │   ├── translations.js         # i18n system (81KB, 193 keys × 8 languages)
│   │   ├── profiles.js             # Profile management
│   │   ├── icon-helper.js          # Icon rendering utility
│   │   ├── data-loader.js          # CSV loading with caching
│   │   ├── theme.js                # Theme toggle
│   │   ├── table-sort.js           # Sortable tables
│   │   ├── fc-status-ui.js         # Fire Crystal data status
│   │   │
│   │   └── modules/                # Calculator modules
│   │       ├── calculator.js       # Charms calculator logic
│   │       ├── chief-gear-calculator.js    # Chief Gear logic
│   │       ├── fire-crystals-calculator.js # Fire Crystals logic
│   │       └── war-laboratory.js   # War Academy logic
│   │
│   ├── style/                      # Stylesheets
│   │   └── style.css               # Main styles (CSS variables, dark/light theme)
│   │
│   └── assets/                     # Data and images
│       ├── resource_data.xlsx      # Source of truth (Excel workbook)
│       ├── charms_costs.csv        # Charms data
│       ├── chief_gear_costs.csv    # Chief Gear data
│       ├── fire_crystals_costs.csv # Fire Crystals data
│       ├── resource_costs.csv      # Resource costs
│       ├── building_power.csv      # Building power data
│       └── *.png                   # Resource icons
│
├── scripts/                        # Data extraction tools
│   ├── extract-charms-costs.js     # Extract charms data from Excel
│   ├── extract-chief-gear-costs.js # Extract chief gear data
│   ├── extract-fire-crystal-refinement.js  # Extract FC data
│   ├── extract-building-power.js   # Extract power data
│   └── export-all-sheets-to-csv.js # Export all sheets
│
└── docs/                           # Documentation
    ├── START_HERE.md               # New developer guide
    ├── MAINTENANCE.md              # Maintenance procedures
    ├── PROJECT_STRUCTURE.md        # Code organization
    ├── CALCULATOR_PAGE_TEMPLATE.md # Template for new calculators
    └── ...                         # Additional guides
```

**Key Directories:**
- **`src/`** - All user-facing files (HTML, JS, CSS, assets)
- **`scripts/`** - Build tools for data extraction from Excel
- **`docs/`** - Comprehensive documentation guides

---

## 📊 Data Pipeline

### Data Flow
```
resource_data.xlsx (Source of Truth)
        ↓
   [npm scripts]
        ↓
   CSV files (src/assets/)
        ↓
   data-loader.js (caching)
        ↓
   Calculator modules
        ↓
   User interface
```

### Authoritative Data Source
**`src/assets/resource_data.xlsx`** contains all game data organized in sheets:
- Charms costs and power
- Chief Gear costs and SVS points
- Fire Crystals refinement costs and times
- Building power values
- War Academy research tree

### Data Extraction Commands
```bash
# Extract all data after Excel updates
npm run import:all

# Individual extractors
npm run import:charms        # Charms data
npm run import:chief-gear    # Chief Gear data
npm run import:fc            # Fire Crystals data
npm run import:power         # Building power data

# Export all sheets to CSV
npm run export:sheets

# Analyze Excel workbook structure
npm run analyze:sheets
```

### CSV Data Files
Each calculator loads data from CSV files:
- **Charms**: `src/assets/charms_costs.csv` (level, guides, designs, secrets, power, svsPoints)
- **Chief Gear**: `src/assets/chief_gear_costs.csv` (level, hardened alloy, polishing solution, design plans, lunar amber, power, svsPoints)
- **Fire Crystals**: `src/assets/fire_crystals_costs.csv` (building, level, fc, rfc, time, meat, wood, coal, iron, power)
- **War Academy**: Built from inline Helios tree data (supports CSV in future)

### Data Loader
`src/Scripts/data-loader.js` provides:
- CSV parsing with caching
- Automatic cache refresh
- Error handling
- Fallback to inline defaults if CSV fails

---

## 🌍 Internationalization

### Supported Languages
- 🇬🇧 **English (EN)** - Default
- 🇪🇸 **Spanish (ES)**
- 🇰🇷 **Korean (KO)**
- 🇷🇺 **Russian (RU)**
- 🇫🇷 **French (FR)**
- 🇩🇪 **German (DE)**
- 🇵🇹 **Portuguese (PT)**
- 🇮🇹 **Italian (IT)**

### Translation System
**`src/Scripts/translations.js`** (81KB) contains:
- 193 translation keys per language
- Complete parity across all 8 languages
- UI strings, labels, messages, tooltips

### How It Works
1. HTML elements use `data-i18n` attributes:
   ```html
   <button data-i18n="calculate">Calculate</button>
   ```

2. JavaScript accesses translations:
   ```javascript
   const text = I18n.t('calculate');  // Returns "Calculate" in current language
   ```

3. Language preference stored in localStorage
4. Language selector on every page

### Adding Translations
1. Open `src/Scripts/translations.js`
2. Add key to all 8 language objects
3. Use key in HTML: `data-i18n="your-new-key"`
4. See [I18N_SYSTEM.md](I18N_SYSTEM.md) for details

---

## 💾 Profile System

### Features
- **Save Multiple Profiles** - Store different character configurations
- **Inventory Tracking** - Track owned resources across calculators
- **Profile Management** - Save, load, rename, delete profiles
- **Gap Calculation** - Shows "Need X more" or "Have X extra" based on inventory
- **Cross-Calculator** - Profiles work across all calculators
- **Persistent Storage** - Uses localStorage (survives browser restart)

### Usage
1. Click "Save Profile" button
2. Enter profile name
3. Current values and inventory saved
4. Load profile anytime via dropdown
5. Inventory automatically included in calculations

### Storage
- **Location**: Browser localStorage
- **Key**: `wos-profiles`
- **Format**: JSON with profile name, values, inventory, timestamp
- **Limit**: ~5-10MB depending on browser

See [PROFILES_SYSTEM.md](docs/PROFILES_SYSTEM.md) for technical details.

---

## 🎨 Theme System

### Dark/Light Mode
- Toggle button on every page
- Preference saved to localStorage
- CSS variables for easy customization
- Smooth transitions between themes

### CSS Variables
Located in `src/style/style.css`:
```css
:root {
  --primary-bg: #1e1e2e;
  --secondary-bg: #2a2a3a;
  --accent: #7c6cff;
  --text-primary: #e0e0e0;
  /* ... more variables */
}

html.light-theme {
  --primary-bg: #f5f5f5;
  --secondary-bg: #ffffff;
  --accent: #5a4fcf;
  --text-primary: #2c2c2c;
  /* ... more variables */
}
```

See [THEME_SYSTEM.md](THEME_SYSTEM.md) for customization guide.

---

## 🛠️ Development

### Setup Development Environment
```bash
# Install dependencies
npm install

# Start dev server
npm start

# Run CSS linter
npm run lint

# Auto-fix CSS issues
npm run lint:fix
```

### Code Style
- **CSS**: Linted with stylelint (see `.stylelintrc.json`)
- **JavaScript**: Modular design with shared helpers
- **HTML**: Semantic HTML5 with ARIA attributes
- **Comments**: Extensive inline documentation

### Adding a New Calculator
1. Read [docs/New Calculator Page Checklist.md](docs/New Calculator Page Checklist.md)
2. Follow [CALCULATOR_PAGE_TEMPLATE.md](docs/CALCULATOR_PAGE_TEMPLATE.md)
3. Create HTML page in `src/`
4. Create calculator module in `src/Scripts/modules/`
5. Add CSV data file to `src/assets/`
6. Add extraction script to `scripts/`
7. Update navigation links in all pages
8. Add translations for all UI strings

### Shared Helpers
Reuse these modules to avoid duplication:
- **`icon-helper.js`** - Render resource icons consistently
- **`data-loader.js`** - Load CSV with caching
- **`profiles.js`** - Profile management across calculators
- **`translations.js`** - i18n system
- **`table-sort.js`** - Sortable tables
- **`theme.js`** - Theme toggle

See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for detailed workflow.

---

## 📦 Build & Deploy

### GitHub Pages
- **Entry Point**: `index.html` in repository root
- **Static Hosting**: All assets loaded from `src/` paths
- **Relative Paths**: Ensure paths work from root level
- **Branch**: Deploy from `main` or `gh-pages` branch

### Netlify
- Configuration in `netlify.toml`
- Build command: `npm run build` (if needed)
- Publish directory: `./` (root)

### Manual Deployment
1. Clone repository
2. Upload all files to web server
3. Ensure `index.html` is at web root
4. Verify `src/` directory accessible
5. Test in browser

### Cache Considerations
- CSV files cached by `data-loader.js`
- Hard refresh to clear: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
- localStorage persists across sessions
- Clear browser cache if updates don't appear

---

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes following code style
4. Run linter: `npm run lint`
5. Test your changes in multiple browsers
6. Update documentation if needed
7. Commit: `git commit -m "feat: your feature description"`
8. Push: `git push origin feature/your-feature`
9. Open Pull Request

### Contribution Guidelines
- **Code Style**: Follow existing patterns, use shared helpers
- **Documentation**: Update relevant docs for any changes
- **Testing**: Test in Chrome, Firefox, Edge, Safari
- **Translations**: Add keys to all 8 languages
- **Data**: Keep Excel as source of truth, regenerate CSVs
- **Commits**: Use conventional commits format

### Areas to Contribute
- 🐛 Bug fixes
- ✨ New calculator features
- 🌍 Translation improvements
- 📝 Documentation enhancements
- 🎨 UI/UX improvements
- ♿ Accessibility improvements
- 🚀 Performance optimizations

---

## 📚 Documentation

### Essential Reading
- **[DOCUMENTATION_MASTER.md](DOCUMENTATION_MASTER.md)** - Master index and navigation hub ⭐
- **[CHANGELOG.md](CHANGELOG.md)** - Complete version history
- **[TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)** - System architecture

### Guides by Role
- **New Users**: [README.md](README.md) (this file)
- **Translators**: [I18N_SYSTEM.md](I18N_SYSTEM.md)
- **Data Editors**: [DATA_PIPELINE.md](DATA_PIPELINE.md)
- **Developers**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **Maintainers**: [docs/MAINTENANCE.md](docs/MAINTENANCE.md)
- **AI Agents**: [AI_AGENT_GUIDE.md](AI_AGENT_GUIDE.md)

### Detailed Documentation
See [DOCUMENTATION_MASTER.md](DOCUMENTATION_MASTER.md) for complete index of all 34 documentation files organized by topic.

---

## 🐛 Troubleshooting

### Common Issues

**Calculations are wrong**
- Check browser console (F12) for JavaScript errors
- Verify CSV data loaded: Network tab should show 200 status
- Clear localStorage and reload
- Check inventory values if using profiles

**Translations not showing**
- Verify translation key exists in `translations.js` for all 8 languages
- Check HTML element has correct `data-i18n` attribute
- Check language selector - should save to localStorage
- Clear cache and hard refresh

**Profile not saving**
- Check localStorage enabled (disable private browsing)
- Open DevTools → Application → Local Storage → verify entries
- Check localStorage quota not exceeded
- Try different browser

**CSS changes not applying**
- Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
- Disable browser cache in DevTools
- Check CSS syntax is valid
- Verify no higher-specificity rules overriding

**Data not loading**
- Check CSV files exist in `src/assets/`
- Verify file paths are correct
- Check Network tab for 404 errors
- Clear cache and reload

### Getting Help
1. Check [DOCUMENTATION_MASTER.md](DOCUMENTATION_MASTER.md) for relevant guide
2. Review [docs/MAINTENANCE.md](docs/MAINTENANCE.md) troubleshooting section
3. Check browser console for specific error messages
4. Open issue on GitHub with reproduction steps

---

## 📊 Project Stats

- **Version**: 2.1.0 (War Laboratory branch)
- **Languages**: 8 (EN, ES, KO, RU, FR, DE, PT, IT)
- **Translation Keys**: 193 per language (1,544 total)
- **Calculators**: 4 active, 2 coming soon
- **Documentation**: 34 markdown files (~250KB)
- **Code**: ~5,000 lines JavaScript + HTML
- **CSS**: 347 lines (linted, organized)

---

## 📄 License

Community project for Whiteout Survival players. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Whiteout Survival Community** - For game data and feedback
- **Contributors** - For translations, bug reports, and improvements
- **Players** - For using and supporting the calculator suite

---

## 🔗 Links

- **Repository**: [github.com/Orizzi/WOS-Forge](https://github.com/Orizzi/WOS-Forge)
- **Documentation**: [DOCUMENTATION_MASTER.md](DOCUMENTATION_MASTER.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Issues**: [github.com/Orizzi/WOS-Forge/issues](https://github.com/Orizzi/WOS-Forge/issues)

---

**Happy Calculating! ❄️🔥**

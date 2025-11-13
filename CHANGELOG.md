# Changelog

All notable changes to the Whiteout Survival Calculator project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features
- War Academy calculator with research path optimization
- Pets calculator with evolution tracking
- Experts calculator
- Full mobile app version
- Export/import profiles to JSON files
- Multi-language support expansion (FR, DE, PT, ZH, JA)
- Performance optimizations for large datasets
- Advanced filtering and search in results tables

---

## [2.0.0] - 2024-11-13

### 🎉 Major Refactor: Architecture & Accessibility Overhaul

#### Added
- **Shared Utilities**
  - Created `icon-helper.js` - Centralized resource icon rendering across all calculators
  - Created `data-loader.js` - CSV caching and performance optimization utility
  - Created `fire-crystals-power-extension.js` - Non-cumulative building power calculation system
  - Added `building_power.csv` - Placeholder power data for Fire Crystals buildings (FC1-FC10)

- **Resource Icons (SVG)**
  - `charm-guides.svg` - Purple book icon for charm guides
  - `charm-designs.svg` - Blue blueprint icon for charm designs
  - `charm-secrets.svg` - Pink lock icon for charm secrets
  - `hardened-alloy.svg` - Gray metallic icon for chief gear resource
  - `polishing-solution.svg` - Green flask icon for chief gear resource
  - `design-plans.svg` - Blue document icon for chief gear resource
  - `lunar-amber.svg` - Gold/amber icon for chief gear resource

- **Accessibility Features**
  - Semantic HTML5 landmarks (`<header role="banner">`, `<nav role="navigation">`, `<main role="main">`)
  - ARIA labels across all pages (`aria-labelledby`, `aria-label`, `aria-describedby`)
  - Improved heading hierarchy with unique IDs
  - Enhanced screen reader support for dynamic content
  - Better keyboard navigation focus states

- **Responsive Design**
  - Mobile-friendly navigation with flex-wrap
  - Minimum touch target size of 44x44px for all interactive elements
  - Table responsive wrapper with horizontal scroll for mobile
  - Media queries for 480px, 600px, 900px, and 1200px breakpoints
  - Compact spacing for small screens

- **Charms Calculator**
  - Inventory tracking for Guides, Designs, and Secrets
  - Gap calculation showing "Need X more" or "Extra X" resources
  - Batch control labels with "Batch" badges for clarity
  - Improved help text for batch controls
  - Visual icons in totals section and result tables

- **Fire Crystals Calculator**
  - Building power calculation (non-cumulative, desired-level only)
  - Power totals displayed dynamically in results section
  - Integration with `building_power.csv` for data override capability

#### Changed
- **Code Architecture**
  - Refactored `calculator.js` (Charms) to use shared `IconHelper` instead of inline icon logic
  - Refactored `chief-gear-calculator.js` to delegate icon rendering to `IconHelper`
  - Refactored `fire-crystals-calculator.js` to use `IconHelper` for consistency
  - Moved from inline duplicate icon code to centralized utility pattern

- **HTML Structure**
  - Updated `index.html` with semantic landmarks and ARIA attributes
  - Updated `charms.html` with improved accessibility and inventory section
  - Updated `chiefGear.html` with semantic HTML5 landmarks
  - Updated `fireCrystals.html` with semantic landmarks and power extension script
  - Enhanced `warAcademy.html` with "Coming Soon" teaser page
  - Enhanced `pets.html` with "Coming Soon" teaser page

- **CSS Improvements**
  - Added `.table-responsive` class for mobile scrolling
  - Enforced minimum touch target sizes (44px)
  - Added 480px breakpoint for extra-small screens
  - Improved focus states for accessibility

#### Removed
- Heavy placeholder calculator scaffolding from War Academy page
- Heavy placeholder calculator scaffolding from Pets page
- Duplicate icon mapping code from individual calculators

#### Fixed
- Power calculation now uses desired-level only (non-cumulative) across all calculators
- Icon rendering consistency across Charms, Chief Gear, and Fire Crystals
- Mobile navigation wrapping and touch target sizing
- Accessibility violations for missing ARIA labels and semantic structure

---

## [1.5.0] - 2024-11-10

### CSV Data Import System

#### Added
- **Data Import Pipeline**
  - `extract-building-resources.js` - Node.js script to extract Fire Crystals building data from Excel
  - `extract-charms-costs.js` - Node.js script to extract charm costs from Excel
  - `extract-chief-gear-costs.js` - Node.js script to extract chief gear costs from Excel
  - `resource_costs.csv` - Generated CSV for Fire Crystals resources (F30 → FC10)
  - `charms_costs.csv` - Generated CSV for charm upgrade costs
  - `chief_gear_costs.csv` - Generated CSV for chief gear costs

- **Runtime CSV Loading**
  - Automatic CSV override system in all calculators
  - Fallback to built-in defaults if CSV not available
  - Console logging for successful CSV imports

- **NPM Scripts**
  - `npm run import:all` - Extract all data from Excel
  - `npm run import:resources` - Extract Fire Crystals data only
  - `npm run import:charms` - Extract charms data only
  - `npm run import:chief-gear` - Extract chief gear data only

#### Changed
- Excel workbook (`resource_data.xlsx`) is now authoritative data source
- All calculators load CSV data at runtime instead of hardcoded values
- Documentation updated with data import procedures

---

## [1.4.0] - 2024-11-08

### Chief Gear Calculator Launch

#### Added
- **Chief Gear Calculator (`chiefGear.html`)**
  - Full gear progression system (Green → Red T4)
  - 46 gear levels with sub-tiers (Green, Blue, Purple, Purple T1, Gold, Gold T1-T2, Red, Red T1-T4)
  - Six gear pieces: Weapon, Helmet, Armor, Boots, Trinket, Sigil
  - Resource tracking: Hardened Alloy, Polishing Solution, Design Plans, Lunar Amber
  - Power and SvS Points calculation
  - Inventory management with gap calculation
  - Batch controls for quick level setting
  - Profile system (save/load/rename/delete)

- **Chief Gear Calculator Script (`chief-gear-calculator.js`)**
  - Cost calculation engine for all 46 levels
  - Batch control system for all six pieces
  - Inventory subtraction and "still needed" display
  - Detailed breakdown table with per-piece costs
  - CSV override support from `chief_gear_costs.csv`
  - Multi-language support (EN, ES, KO, RU)

#### Changed
- Navigation bar updated with Chief Gear link
- Consistent profile system across Charms and Chief Gear
- Unified styling for inventory sections

---

## [1.3.0] - 2024-11-05

### Fire Crystals Calculator Launch

#### Added
- **Fire Crystals Calculator (`fireCrystals.html`)**
  - Building upgrade system (F30 → FC10 for core buildings)
  - Eight buildings: Furnace, Embassy, Command Center, Infirmary, Infantry Camp, Marksman Camp, Lancer Camp, War Academy
  - Resource tracking: Fire Crystals, Refine Crystals, Meat, Wood, Coal, Iron
  - Time calculation with speedup reduction
  - Construction speed bonus integration
  - Inventory management with gap visualization
  - Profile system

- **Fire Crystals Calculator Script (`fire-crystals-calculator.js`)**
  - Complex level key system (30-1 through 30-4, FC1 through FC10 with sub-steps)
  - Time calculation considering speedups and construction speed bonuses
  - Multi-building total aggregation
  - CSV override support from `resource_costs.csv`
  - Multi-language support (EN, ES, KO, RU)

#### Changed
- Navigation expanded to include Fire Crystals link
- Profile system standardized across all calculators

---

## [1.2.0] - 2024-11-02

### Code Modularization & Quality Improvements

#### Added
- **Modular JavaScript Architecture**
  - `theme.js` - Dedicated theme toggle and persistence
  - `profiles.js` - Unified profile management system
  - `table-sort.js` - Sortable table functionality
  - `calculator.js` - Core calculation logic (split from monolith)
  - `translations.js` - Multi-language support system

- **CSS Quality Tools**
  - Stylelint integration with configuration (`.stylelintrc.json`)
  - CSS linting npm scripts
  - Code quality validation in development workflow

- **Documentation System**
  - `docs/START_HERE.md` - Complete project overview
  - `docs/MAINTENANCE.md` - Maintenance procedures and data import guide
  - `docs/PROJECT_STRUCTURE.md` - Detailed code structure explanation
  - `docs/QUICK_REFERENCE.md` - Quick lookup guide for common tasks
  - `docs/SETUP_LINT_VERIFY.md` - Linting setup and verification
  - `docs/button-improvements/` - Button enhancement documentation

#### Changed
- Removed monolithic `script.js` in favor of modular architecture
- Split responsibilities across focused modules for maintainability
- Improved code organization with clear separation of concerns
- Enhanced inline documentation and comments

#### Removed
- Deprecated `script.js` (replaced by modular scripts)
- Redundant CSS rules and dead code

---

## [1.1.0] - 2024-10-28

### Enhanced User Experience & Visual Improvements

#### Added
- **Button Enhancements**
  - Consistent button styling across all actions
  - Color-coded button types: Primary (blue), Secondary (purple), Danger (red)
  - Hover effects with lift animation and shadow
  - Focus states for accessibility (purple outline)
  - Disabled state styling

- **Batch Controls**
  - Quick-set dropdowns for all charms of same type
  - "Set all Hat FROM to 0" functionality
  - "Set all Chestplate TO to 10" functionality
  - Help text explaining batch control usage

- **Profile Management**
  - Rename profile functionality
  - Delete profile with confirmation
  - Overwrite existing profile
  - Better profile selection UX

#### Changed
- Improved spacing and layout throughout interface
- Enhanced visual hierarchy with better typography
- More consistent color palette application
- Better mobile responsiveness for touch interactions

---

## [1.0.0] - 2024-10-20

### Initial Release

#### Added
- **Charms Calculator (`charms.html`)**
  - Calculate upgrade costs for 6 charm types (Hat, Chestplate, Ring, Watch, Pants, Staff)
  - 8 slots per charm type (48 total charm slots)
  - Levels 0-15 progression system
  - Resource tracking: Guides, Designs, Secrets
  - Power and SvS Points calculation
  - Profile save/load system using localStorage
  - Reset all functionality

- **Core Features**
  - Dark/Light theme toggle with persistence
  - Sortable results table (click headers to sort)
  - Total resource calculation across all charms
  - Estimated days needed based on daily income rates
  - Browser localStorage for data persistence

- **Charms Calculator Script (`calculator.js`)**
  - Cost calculation engine with `sumCosts()` function
  - Level progression from 0 to 15 with resource costs
  - Power and SvS Points accumulation
  - Batch operations for quick input setting
  - Table generation with sortable columns

- **Theme System (`theme.js`)**
  - Dark mode (default)
  - Light mode
  - Persistent theme choice in localStorage
  - Smooth transitions between themes

- **Styling (`style.css`)**
  - Modern dark theme with purple accents
  - CSS variables for easy theming
  - Responsive grid layouts
  - Button hover effects and transitions
  - Form input styling
  - Table styling with alternating rows

- **Project Infrastructure**
  - Git repository initialization
  - README.md with comprehensive documentation
  - Folder structure: src/, docs/, scripts/
  - Package.json for npm dependencies

---

## Development Guidelines

### Version Numbering
- **Major (X.0.0)**: Breaking changes, major feature releases, architecture overhauls
- **Minor (0.X.0)**: New features, calculators, or significant enhancements
- **Patch (0.0.X)**: Bug fixes, small improvements, documentation updates

### Change Categories
- **Added**: New features, files, or functionality
- **Changed**: Modifications to existing features or behavior
- **Deprecated**: Features marked for removal (not currently used)
- **Removed**: Deleted features, files, or functionality
- **Fixed**: Bug fixes and error corrections
- **Security**: Security improvements (not currently applicable)

---

## Future Roadmap

### Version 3.0.0 (Planned)
- Full War Academy calculator with research trees
- Pets calculator with evolution paths
- Experts calculator with skill progression
- Advanced analytics dashboard
- Profile export/import with cloud sync
- Performance optimizations for large datasets

### Version 2.5.0 (In Progress)
- Complete mobile optimization
- PWA (Progressive Web App) support
- Offline functionality
- Enhanced data visualization with charts
- Advanced filtering and search capabilities

---

## Contributors

- **Orizzi** - Project creator and lead developer
- Community feedback and testing from WOS players

---

## License

This project is developed for the Whiteout Survival gaming community.
All game data and trademarks belong to their respective owners.

---

**Last Updated**: November 13, 2024

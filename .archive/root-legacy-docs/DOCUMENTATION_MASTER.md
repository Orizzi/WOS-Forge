# WOS Calculator - Master Documentation Index

**Version:** 2.1.0  
**Last Updated:** December 2, 2025  
**Project:** Whiteout Survival Calculator  
**Repository:** WOS-Forge  

---

## 📖 Quick Start - Read This First

**New to this project?** Start here:
1. Read [Project Overview](#project-overview) below (2 minutes)
2. Jump to [For Your Role](#for-your-role) to find your starting point
3. Bookmark this page as your navigation hub

**Need something specific?** Use [Quick Navigation](#quick-navigation) below.

---

## 🎯 Project Overview

### What Is This?
A comprehensive calculator suite for Whiteout Survival game players to plan resource requirements across multiple game systems:
- **Charms Calculator** - Calculate charm upgrade costs
- **Chief Gear Calculator** - Plan gear upgrades (46 levels)
- **Fire Crystals Calculator** - Calculate building refinement costs with time estimates
- **War Academy Calculator** - Plan Helios research tree progression
- **Experts Calculator** - Track expert leveling (coming soon)
- **Pets Calculator** - Pet upgrade planning (coming soon)

### Current Status
- **Version:** 2.1.0 (War Laboratory branch)
- **Languages:** 8 (EN, ES, KO, RU, FR, DE, PT, IT)
- **Translation Keys:** 193 per language
- **Calculators:** 4 active, 2 coming soon
- **Profile System:** Full save/load with inventory tracking
- **Theme:** Dark/Light mode with persistent preference

### Key Features
- ✅ Complete i18n system with 8 languages
- ✅ Profile management with inventory tracking
- ✅ Resource gap calculation (need vs. owned)
- ✅ Time estimation for upgrades
- ✅ CSV data import pipeline
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark/Light theme toggle
- ✅ Data persistence (localStorage)
- ✅ Semantic HTML with ARIA accessibility

---

## 👥 For Your Role

### 🆕 New User / Player
**Goal:** Use the calculators

**Start here:**
1. **README.md** - Project introduction and features
2. Open `index.html` in browser
3. Navigate to desired calculator
4. **USER_GUIDE.md** (to be created) - How to use each calculator

**Time needed:** 10 minutes

---

### 🎨 Content Editor / Translator
**Goal:** Update translations or game data

**Start here:**
1. [I18N_SYSTEM.md](#translations--i18n) - Translation system overview
2. [DATA_PIPELINE.md](#data-management) - How data flows through the system
3. `src/Scripts/translations.js` - All translation keys and values
4. CSV files in root directory - Game data (costs, resources, etc.)

**Common tasks:**
- Add translation: Edit `translations.js`, add key to all 8 languages
- Update costs: Edit relevant CSV file, refresh browser
- Fix typo: Search `translations.js` for the key, update value

**Time needed:** 15-30 minutes per task

---

### 💻 Developer / Maintainer
**Goal:** Fix bugs, add features, maintain codebase

**Start here:**
1. [TECHNICAL_ARCHITECTURE.md](#architecture) - System design and patterns
2. [PROJECT_STRUCTURE.md](#code-organization) - File organization
3. [DEVELOPER_GUIDE.md](#developer-guide) - Development workflow
4. [CALCULATOR_LOGIC.md](#calculator-systems) - How calculations work

**Key files:**
- `src/Scripts/modules/` - Core calculator logic
- `src/Scripts/profiles.js` - Profile management
- `src/Scripts/translations.js` - i18n system
- `src/Scripts/icon-helper.js` - Icon rendering utility
- `src/Scripts/data-loader.js` - CSV import with caching

**Time needed:** 1-2 hours for full understanding

---

### 🤖 AI Agent / LLM
**Goal:** Understand codebase to assist with development

**Start here:**
1. [AI_AGENT_GUIDE.md](#ai-agent-guide) - Project context for AI
2. [MODULE_GRAPH.md](#system-architecture) - Module dependencies
3. [TECHNICAL_ARCHITECTURE.md](#architecture) - Technical deep dive
4. [CHANGELOG.md](#changelog) - Complete version history

**Key context:**
- Modular architecture with shared utilities
- localStorage for persistence
- CSV as source of truth for game data
- Translation keys for all user-facing text
- Profile system with inventory tracking

**Time needed:** 30 minutes for context loading

---

## 🗂️ Documentation Structure

### 📁 Root Level (Master Documents)

#### Essential Reading
| Document | Purpose | Audience | Priority |
|----------|---------|----------|----------|
| **DOCUMENTATION_MASTER.md** | This file - navigation hub | Everyone | ⭐⭐⭐ |
| **README.md** | Project introduction | New users | ⭐⭐⭐ |
| **CHANGELOG.md** | Version history | All | ⭐⭐ |
| **TECHNICAL_ARCHITECTURE.md** | System design | Developers | ⭐⭐⭐ |

#### System Guides
| Document | Purpose | Audience | Priority |
|----------|---------|----------|----------|
| **AI_AGENT_GUIDE.md** | AI context and patterns | AI/LLMs | ⭐⭐ |
| **I18N_SYSTEM.md** | Translation system | Translators/Devs | ⭐⭐ |
| **DATA_PIPELINE.md** | Data flow and CSV import | Devs/Data editors | ⭐⭐ |
| **DEVELOPER_GUIDE.md** | Development workflow | Developers | ⭐⭐ |
| **CALCULATOR_LOGIC.md** | Calculation methods | Developers | ⭐⭐ |

#### Feature Documentation
| Document | Purpose | Audience | Priority |
|----------|---------|----------|----------|
| **CHIEF_GEAR_REFACTOR_COMPLETE.md** | Chief Gear refactor notes | Developers | ⭐ |
| **TRANSLATION_ANALYSIS_REPORT.md** | Recent i18n updates | Translators | ⭐ |
| **MODULE_GRAPH.md** | Module dependencies | Developers | ⭐ |
| **THEME_SYSTEM.md** | Dark/Light theme | Developers | ⭐ |
| **SERVICE_WORKER_NOTES.md** | PWA notes (future) | Developers | ⭐ |
| **UI_FLOW.md** | User interface flow | Designers | ⭐ |
| **PROJECT_OVERVIEW.md** | High-level summary | All | ⭐ |

#### Deprecated/Draft
| Document | Status | Note |
|----------|--------|------|
| **README.draft.md** | Draft | Old version, archive |
| **README_UNIFIED.md** | Superseded | Merged into README.md |
| **DOCUMENTATION_INDEX.md** | Superseded | Replaced by this file |
| **DOCUMENTATION_COMPLETE.md** | Superseded | Replaced by this file |

---

### 📁 docs/ Folder (Detailed Guides)

#### Essential Guides
| Document | Purpose | Audience | Priority |
|----------|---------|----------|----------|
| **START_HERE.md** | Complete project overview | New developers | ⭐⭐⭐ |
| **MAINTENANCE.md** | Maintenance procedures | Maintainers | ⭐⭐⭐ |
| **QUICK_REFERENCE.md** | Quick lookup guide | All | ⭐⭐ |

#### Reference Guides
| Document | Purpose | Audience | Priority |
|----------|---------|----------|----------|
| **PROJECT_STRUCTURE.md** | Code organization | Developers | ⭐⭐⭐ |
| **CALCULATOR_PAGE_TEMPLATE.md** | Page template guide | Developers | ⭐⭐ |
| **PROFILES_SYSTEM.md** | Profile management | Developers | ⭐⭐ |
| **CALCULATION_CORE.md** | Core calculation logic | Developers | ⭐⭐ |

#### Development Guides
| Document | Purpose | Audience | Priority |
|----------|---------|----------|----------|
| **SETUP_LINT_VERIFY.md** | Dev environment setup | Developers | ⭐⭐ |
| **New Calculator Page Checklist.md** | Add calculator guide | Developers | ⭐⭐ |
| **UNIFIED_CALC_REFACTOR.md** | Refactor notes | Developers | ⭐ |
| **mobile-ui-notes.md** | Mobile UI considerations | Designers | ⭐ |

#### Archive
| Document | Status | Note |
|----------|--------|------|
| **MASTER_INDEX.md** | Superseded | Old index, replaced by this file |
| **PROJECT_COMPLETE.md** | Superseded | Merged into this file |
| **DOCUMENTATION_INDEX.md** | Duplicate | Same as root, archive |
| **DOCUMENTATION_COMPLETE.md** | Duplicate | Same as root, archive |

---

## 🎯 Quick Navigation

### I Want To...

#### Use the Calculators
→ **README.md** → Quick Start  
→ Open `index.html` in browser  
→ Navigate to desired calculator

#### Understand What Changed
→ **CHANGELOG.md** → Find your version  
→ **TRANSLATION_ANALYSIS_REPORT.md** → Recent i18n updates  
→ **CHIEF_GEAR_REFACTOR_COMPLETE.md** → Chief Gear changes

#### Add a Translation
→ **I18N_SYSTEM.md** → Translation system  
→ `src/Scripts/translations.js` → Add key to all 8 languages  
→ Use `data-i18n="your-key"` in HTML

#### Update Game Data
→ **DATA_PIPELINE.md** → Data import process  
→ Edit relevant CSV file  
→ Refresh browser (data-loader.js auto-caches)

#### Fix a Bug
→ **PROJECT_STRUCTURE.md** → Find the relevant module  
→ **CALCULATOR_LOGIC.md** → Understand calculation logic  
→ **DEVELOPER_GUIDE.md** → Development workflow  
→ Check browser console (F12) for errors

#### Add a New Feature
→ **TECHNICAL_ARCHITECTURE.md** → Understand architecture  
→ **CALCULATOR_PAGE_TEMPLATE.md** → Page structure guide  
→ **DEVELOPER_GUIDE.md** → Best practices  
→ **docs/New Calculator Page Checklist.md** → Checklist

#### Understand the Architecture
→ **TECHNICAL_ARCHITECTURE.md** → Complete system design  
→ **MODULE_GRAPH.md** → Module dependencies  
→ **PROJECT_STRUCTURE.md** → Code organization  
→ **CALCULATION_CORE.md** → Core logic

#### Change Styling
→ **THEME_SYSTEM.md** → Theme variables  
→ `src/style/style.css` → CSS variables  
→ **UI_FLOW.md** → User interface flow

#### Set Up Development Environment
→ **SETUP_LINT_VERIFY.md** → Installation and tools  
→ **DEVELOPER_GUIDE.md** → Workflow and conventions  
→ Run `npm install` to install dependencies

#### Work with Profiles System
→ **PROFILES_SYSTEM.md** → Profile management  
→ `src/Scripts/profiles.js` → Profile code  
→ Uses localStorage for persistence

#### Add a New Calculator
→ **docs/New Calculator Page Checklist.md** → Step-by-step  
→ **CALCULATOR_PAGE_TEMPLATE.md** → Template guide  
→ **CALCULATOR_LOGIC.md** → Logic patterns  
→ Follow existing calculator patterns

---

## 📚 Documentation by Topic

### Architecture
- **TECHNICAL_ARCHITECTURE.md** - Complete system architecture (29KB, comprehensive)
- **MODULE_GRAPH.md** - Module dependencies and relationships
- **PROJECT_STRUCTURE.md** - File organization and code structure
- **CALCULATION_CORE.md** - Core calculation engine

### Calculator Systems
- **CALCULATOR_LOGIC.md** - Calculation methods and formulas
- **CALCULATOR_PAGE_TEMPLATE.md** - Page structure template (45KB, very detailed)
- **docs/New Calculator Page Checklist.md** - Step-by-step guide
- **CHIEF_GEAR_REFACTOR_COMPLETE.md** - Chief Gear implementation notes
- **UNIFIED_CALC_REFACTOR.md** - Calculator refactor notes

### Translations & i18n
- **I18N_SYSTEM.md** - Translation system overview
- **TRANSLATION_ANALYSIS_REPORT.md** - Recent translation updates (Dec 2, 2025)
- `src/Scripts/translations.js` - All 193 keys × 8 languages

### Data Management
- **DATA_PIPELINE.md** - CSV import and data flow
- CSV files: `resource_costs.csv`, `charms_costs.csv`, `chief_gear_costs.csv`, `building_power.csv`
- `src/Scripts/data-loader.js` - Data loading with caching

### Profile System
- **PROFILES_SYSTEM.md** - Profile management system (Dec 2, 2025)
- `src/Scripts/profiles.js` - Profile save/load/manage
- Uses localStorage for persistence

### UI & Theme
- **THEME_SYSTEM.md** - Dark/Light theme implementation
- **UI_FLOW.md** - User interface flow
- **mobile-ui-notes.md** - Mobile considerations
- `src/style/style.css` - All styling with CSS variables

### Development
- **DEVELOPER_GUIDE.md** - Development workflow
- **SETUP_LINT_VERIFY.md** - Environment setup
- **AI_AGENT_GUIDE.md** - AI-assisted development patterns
- **MAINTENANCE.md** - Maintenance procedures

### Version History
- **CHANGELOG.md** - Complete version history (v1.0.0 to v2.1.0)
- Git commit history on war-laboratory branch

---

## 🔍 Find by File Type

### Core Application Files

**HTML Pages:**
- `index.html` - Home page
- `src/charms.html` - Charms calculator
- `src/chiefGear.html` - Chief Gear calculator
- `src/fireCrystals.html` - Fire Crystals calculator
- `src/war-academy.html` - War Academy calculator
- `src/experts.html` - Experts calculator
- `src/pets.html` - Pets calculator
- `src/coming-soon.html` - Placeholder page

**JavaScript Modules:**
- `src/Scripts/modules/calculator.js` - Charms calculator logic
- `src/Scripts/modules/chief-gear-calculator.js` - Chief Gear logic
- `src/Scripts/modules/fire-crystals-calculator.js` - Fire Crystals logic
- `src/Scripts/modules/war-laboratory.js` - War Academy logic
- `src/Scripts/profiles.js` - Profile management
- `src/Scripts/translations.js` - i18n system (81KB, 193 keys × 8 languages)
- `src/Scripts/icon-helper.js` - Icon rendering utility
- `src/Scripts/data-loader.js` - CSV data loader with caching
- `src/Scripts/theme.js` - Theme toggle
- `src/Scripts/table-sort.js` - Table sorting
- `src/Scripts/fc-status-ui.js` - Fire Crystal data status UI

**CSS:**
- `src/style/style.css` - All application styling

**Data Files (CSV):**
- `resource_costs.csv` - Fire Crystals refinement costs
- `charms_costs.csv` - Charm upgrade costs
- `chief_gear_costs.csv` - Gear upgrade costs
- `building_power.csv` - Building power data

---

## 📊 Documentation Statistics

### Coverage
- **Total Documentation Files:** 34 markdown files
- **Total Documentation Size:** ~250KB
- **Code Comments:** Extensive inline comments in all JS modules
- **Languages Documented:** 8 (EN, ES, KO, RU, FR, DE, PT, IT)
- **Features Documented:** 100% of implemented features

### By Category
- **Architecture Docs:** 4 files (~45KB)
- **System Guides:** 9 files (~30KB)
- **Feature Docs:** 7 files (~25KB)
- **Development Guides:** 8 files (~50KB)
- **Reference Guides:** 6 files (~80KB)

### Quality Metrics
- ✅ All major features documented
- ✅ All modules have inline comments
- ✅ Translation system fully documented
- ✅ Data pipeline documented
- ✅ Architecture patterns explained
- ✅ Development workflow covered
- ✅ AI agent guidance provided

---

## 🎓 Learning Paths

### Path 1: Quick User (15 minutes)
**Goal:** Use the calculators
1. README.md → Introduction (5 min)
2. Open index.html in browser (2 min)
3. Try a calculator (5 min)
4. Bookmark QUICK_REFERENCE.md (3 min)

### Path 2: Content Editor (45 minutes)
**Goal:** Update translations or data
1. I18N_SYSTEM.md → Translation system (10 min)
2. DATA_PIPELINE.md → Data flow (10 min)
3. Open translations.js → Understand structure (10 min)
4. Make a test edit → Verify (15 min)

### Path 3: New Developer (3 hours)
**Goal:** Contribute to codebase
1. README.md → Overview (15 min)
2. TECHNICAL_ARCHITECTURE.md → Architecture (45 min)
3. PROJECT_STRUCTURE.md → Code organization (30 min)
4. DEVELOPER_GUIDE.md → Workflow (20 min)
5. Pick a module → Read code + comments (30 min)
6. SETUP_LINT_VERIFY.md → Set up environment (20 min)
7. Make a small change → Test (20 min)

### Path 4: AI Agent Context Loading (30 minutes)
**Goal:** Understand codebase for assistance
1. AI_AGENT_GUIDE.md → AI-specific context (10 min)
2. MODULE_GRAPH.md → Dependencies (5 min)
3. TECHNICAL_ARCHITECTURE.md → System design (10 min)
4. CHANGELOG.md → Recent changes (5 min)

### Path 5: Maintainer (2 hours)
**Goal:** Long-term maintenance capability
1. README.md → Overview (10 min)
2. MAINTENANCE.md → Procedures (30 min)
3. DATA_PIPELINE.md → Data updates (15 min)
4. I18N_SYSTEM.md → Translations (15 min)
5. PROFILES_SYSTEM.md → Profile management (15 min)
6. SETUP_LINT_VERIFY.md → Tools (15 min)
7. CHANGELOG.md → History (20 min)

---

## 🆘 Troubleshooting Guide

### Common Issues

#### Calculations Wrong
1. Check browser console (F12) for JavaScript errors
2. Verify CSV data loaded: check Network tab
3. Review CALCULATOR_LOGIC.md for expected behavior
4. Check profiles.js → inventory values applied correctly

#### Translations Not Showing
1. Verify key exists in translations.js (all 8 languages)
2. Check HTML element has `data-i18n="your-key"` attribute
3. Verify language selector is working (localStorage key: `language`)
4. Check browser console for i18n errors

#### Profile Not Saving
1. Check browser localStorage is enabled (not private browsing)
2. Open DevTools → Application → Local Storage → check values
3. Review PROFILES_SYSTEM.md → save/load flow
4. Verify profiles.js → saveProfiles() called correctly

#### CSS Changes Not Showing
1. Hard refresh browser: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Check browser cache settings
3. Verify CSS syntax is valid (use linter)
4. Check browser console for CSS errors

#### Data Not Loading
1. Check CSV files exist in correct location
2. Open Network tab → verify CSV files load (200 status)
3. Check data-loader.js → caching logic
4. Clear localStorage and refresh

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot read property of undefined" | Variable not initialized | Check calculator initialization order |
| "Key not found in translations" | Missing translation key | Add key to all 8 languages in translations.js |
| "CSV parse error" | Malformed CSV file | Check CSV syntax, commas, quotes |
| "localStorage quota exceeded" | Too much data stored | Clear old profiles or increase quota |
| "Profile not found" | Profile deleted or corrupted | Check localStorage, restore from backup |

---

## ✅ Documentation Maintenance

### When to Update
- **Code changes:** Update relevant technical docs same commit
- **New features:** Update CHANGELOG.md + feature-specific docs
- **Bug fixes:** Update troubleshooting sections
- **Translation changes:** Update I18N_SYSTEM.md if system changes
- **Data schema changes:** Update DATA_PIPELINE.md
- **Version releases:** Update CHANGELOG.md with full notes

### How to Update
1. Edit relevant .md file(s)
2. Update "Last Updated" date in file header
3. Update this file (DOCUMENTATION_MASTER.md) if structure changes
4. Commit with clear message: "docs: [description]"
5. Push to repository

### Documentation Versioning
- Documentation version matches project version
- Keep docs in sync with code (same commit)
- Use CHANGELOG.md as single source of truth for versions

---

## 🔄 Recent Updates

### December 2, 2025
- ✅ Created DOCUMENTATION_MASTER.md (this file)
- ✅ Consolidated documentation index
- ✅ Added PROFILES_SYSTEM.md
- ✅ Added TRANSLATION_ANALYSIS_REPORT.md
- ✅ Added UNIFIED_CALC_REFACTOR.md
- ✅ War Academy inventory gap calculation fixed
- ✅ Chief Gear profile loading fixed
- ✅ Complete i18n implementation (8 languages, 193 keys)

### November 13, 2024
- ✅ TECHNICAL_ARCHITECTURE.md comprehensive update
- ✅ CHANGELOG.md complete version history
- ✅ Documentation index created
- ✅ Refactored calculators with shared utilities

### Previous
- See CHANGELOG.md for complete history from v1.0.0 onwards

---

## 📞 Support & Contribution

### Project Information
- **Repository:** WOS-Forge
- **Owner:** Orizzi
- **Current Branch:** war-laboratory
- **Default Branch:** UI
- **License:** Community project for WOS players

### Reporting Issues
1. Check existing documentation first
2. Review CHANGELOG.md for known issues
3. Check browser console for errors (F12)
4. Document steps to reproduce
5. Include browser and version
6. Create issue on GitHub

### Contributing
1. Read TECHNICAL_ARCHITECTURE.md
2. Follow DEVELOPER_GUIDE.md conventions
3. Update relevant documentation
4. Test your changes thoroughly
5. Submit PR with clear description
6. Update CHANGELOG.md for your changes

---

## 📝 Documentation Checklist

Before considering a feature complete:

- [ ] Feature code implemented and tested
- [ ] Inline code comments added
- [ ] Relevant documentation file updated
- [ ] CHANGELOG.md entry added
- [ ] Translation keys added (if user-facing)
- [ ] CSV data updated (if needed)
- [ ] This master index updated (if structural change)
- [ ] Git commit with clear message
- [ ] Tested in multiple browsers

---

## 🎉 Final Notes

This documentation suite provides:
- ✅ Complete navigation system
- ✅ Role-based entry points
- ✅ Topic-based organization
- ✅ Quick reference guides
- ✅ Troubleshooting support
- ✅ Learning paths for all levels
- ✅ Maintenance procedures
- ✅ AI agent guidance

**Everything you need to understand, use, maintain, and extend the WOS Calculator project.**

---

**Start with your role section above, then explore as needed. Welcome! 🚀**

---

**Quick Links:**
- [README](README.md) | [CHANGELOG](CHANGELOG.md) | [TECHNICAL](TECHNICAL_ARCHITECTURE.md)
- [MAINTENANCE](docs/MAINTENANCE.md) | [STRUCTURE](docs/PROJECT_STRUCTURE.md) | [QUICK REF](docs/QUICK_REFERENCE.md)
- [I18N](I18N_SYSTEM.md) | [DATA](DATA_PIPELINE.md) | [DEV GUIDE](DEVELOPER_GUIDE.md)


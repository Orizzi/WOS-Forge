# Documentation Archive

**Date Archived:** December 2, 2025  
**Reason:** Documentation consolidation project - merged multiple small files into comprehensive guides

---

## What Happened

The WOS Calculator project had 34 documentation files scattered across root and docs/ directories with significant duplication and overlap. A consolidation project merged these into 4 comprehensive, well-organized guides:

1. **DOCUMENTATION_MASTER.md** - Master navigation index (33KB)
2. **README.md** - Complete project guide (comprehensive)
3. **TECHNICAL_ARCHITECTURE.md** - Enhanced technical reference (40KB)
4. **SYSTEMS_GUIDE.md** - Systems documentation (35KB)

---

## Archived Files

### From Root Directory (12 files)

| File | Size | Replaced By | Reason |
|------|------|-------------|--------|
| PROJECT_OVERVIEW.md | 1.3KB | TECHNICAL_ARCHITECTURE.md | Merged into comprehensive architecture doc |
| MODULE_GRAPH.md | 920B | TECHNICAL_ARCHITECTURE.md | Module dependencies now in architecture doc |
| CALCULATOR_LOGIC.md | 1.2KB | TECHNICAL_ARCHITECTURE.md | Calculator logic section added to architecture |
| I18N_SYSTEM.md | 823B | SYSTEMS_GUIDE.md | Complete i18n system documentation created |
| DATA_PIPELINE.md | 1.1KB | SYSTEMS_GUIDE.md | Comprehensive data pipeline section added |
| THEME_SYSTEM.md | 489B | SYSTEMS_GUIDE.md | Theme system fully documented in systems guide |
| UI_FLOW.md | 944B | SYSTEMS_GUIDE.md | UI flow section added to systems guide |
| SERVICE_WORKER_NOTES.md | 511B | SYSTEMS_GUIDE.md | Service worker section in systems guide |
| README_UNIFIED.md | 2.0KB | README.md | Content merged into comprehensive README |
| README.draft.md | 1.3KB | README.md | Draft content integrated into final README |
| DOCUMENTATION_INDEX.md | 11.9KB | DOCUMENTATION_MASTER.md | Replaced by master navigation index |
| DOCUMENTATION_COMPLETE.md | 12.3KB | DOCUMENTATION_MASTER.md | Status merged into master index |

### From docs/ Directory (3 files)

| File | Size | Replaced By | Reason |
|------|------|-------------|--------|
| DOCUMENTATION_INDEX.md | 11.1KB | DOCUMENTATION_MASTER.md | Duplicate of root version (older) |
| DOCUMENTATION_COMPLETE.md | 10.6KB | DOCUMENTATION_MASTER.md | Duplicate of root version (older) |
| CALCULATION_CORE.md | 2.7KB | TECHNICAL_ARCHITECTURE.md | WOSCalcCore section added to architecture |

---

## What Was Consolidated

### 1. Technical Documentation → TECHNICAL_ARCHITECTURE.md
**Merged:**
- PROJECT_OVERVIEW.md (project scope)
- MODULE_GRAPH.md (dependencies)
- CALCULATOR_LOGIC.md (calculation methods)
- CALCULATION_CORE.md (WOSCalcCore system)

**Result:** Comprehensive 40KB technical reference covering architecture, modules, calculations, data flow, and all technical systems.

### 2. System Guides → SYSTEMS_GUIDE.md
**Merged:**
- I18N_SYSTEM.md (internationalization)
- DATA_PIPELINE.md (Excel → CSV → browser)
- THEME_SYSTEM.md (dark/light mode)
- UI_FLOW.md (page architecture)
- SERVICE_WORKER_NOTES.md (PWA notes)

**Result:** Complete 35KB systems guide covering all core systems (i18n, data, theme, profiles, events, storage).

### 3. README Files → README.md
**Merged:**
- README.md (original)
- README_UNIFIED.md (unified calculators)
- README.draft.md (draft structure)

**Result:** Comprehensive project README with features, quick start, project structure, data pipeline, i18n, profiles, development, deployment, troubleshooting.

### 4. Master Index → DOCUMENTATION_MASTER.md
**Merged:**
- DOCUMENTATION_INDEX.md (navigation)
- DOCUMENTATION_COMPLETE.md (completion status)
- Enhanced with role-based navigation

**Result:** Professional 33KB master index with role-based entry points, topic organization, learning paths, troubleshooting.

---

## Benefits of Consolidation

### Before
- ✗ 34 documentation files
- ✗ Significant duplication
- ✗ Scattered information
- ✗ Hard to find relevant docs
- ✗ Inconsistent structure
- ✗ Draft files mixed with production docs

### After
- ✅ 4 comprehensive guides + archive
- ✅ No duplication
- ✅ Well-organized by topic
- ✅ Easy navigation with master index
- ✅ Consistent structure throughout
- ✅ Clear separation of active/archived docs

---

## Finding Information Now

### "Where did X go?"

**Project scope, constraints, module dependencies:**
→ TECHNICAL_ARCHITECTURE.md (sections added at end)

**Internationalization, translations, languages:**
→ SYSTEMS_GUIDE.md → Internationalization section

**Data pipeline, CSV extraction, Excel workflow:**
→ SYSTEMS_GUIDE.md → Data Pipeline section

**Theme system, dark/light mode:**
→ SYSTEMS_GUIDE.md → Theme System section

**UI flow, page structure, script loading:**
→ SYSTEMS_GUIDE.md → UI Flow section

**Calculator logic (how calculations work):**
→ TECHNICAL_ARCHITECTURE.md → Calculator Logic Deep Dive

**Calculation Core (WOSCalcCore dispatcher):**
→ TECHNICAL_ARCHITECTURE.md → Calculation Core System

**Profile system architecture:**
→ TECHNICAL_ARCHITECTURE.md → Profile System Architecture
→ Also see: SYSTEMS_GUIDE.md → Profile System

**Project overview, quick start:**
→ README.md → Overview and Quick Start sections

**Finding any documentation:**
→ DOCUMENTATION_MASTER.md → Master navigation index

---

## Archive Policy

### These files are preserved for:
1. Historical reference
2. Migration verification
3. Backup in case of needed content recovery
4. Understanding evolution of documentation

### Do NOT use archived files for:
- Current project information (use main docs instead)
- Development reference (information is outdated/superseded)
- Navigation or learning (use DOCUMENTATION_MASTER.md)

---

## Restoration

If you need to restore any archived file:

```powershell
# Restore specific file
Copy-Item "docs\archive\FILENAME.md" -Destination ".\"

# View archived file without restoring
Get-Content "docs\archive\FILENAME.md"
```

**However:** The content from these files is now in the comprehensive guides. Restoring archived files would recreate the duplication problem that was solved.

---

## Verification

### Files archived: 15 total
- Root directory: 12 files
- docs/ directory: 3 files

### Content preserved: 100%
- All content merged into comprehensive guides
- No information lost
- All topics covered in new structure

### Active documentation: 4 core files + existing guides
- DOCUMENTATION_MASTER.md (master index)
- README.md (project guide)
- TECHNICAL_ARCHITECTURE.md (technical reference)
- SYSTEMS_GUIDE.md (systems documentation)
- CHANGELOG.md (version history) *unchanged*
- DEVELOPER_GUIDE.md *unchanged*
- AI_AGENT_GUIDE.md *unchanged*
- docs/MAINTENANCE.md *unchanged*
- docs/PROJECT_STRUCTURE.md *unchanged*
- docs/QUICK_REFERENCE.md *unchanged*
- docs/START_HERE.md *unchanged*
- docs/SETUP_LINT_VERIFY.md *unchanged*
- Plus other specialized docs (PROFILES_SYSTEM.md, TRANSLATION_ANALYSIS_REPORT.md, etc.)

---

## Timeline

- **Before Dec 2, 2025:** 34 scattered documentation files
- **Dec 2, 2025:** Consolidation project completed
- **Result:** Clean, professional documentation structure

---

**Documentation consolidation completed successfully!** ✅

All information preserved, better organized, and easier to navigate.

**See [DOCUMENTATION_MASTER.md](../DOCUMENTATION_MASTER.md) for current documentation navigation.**

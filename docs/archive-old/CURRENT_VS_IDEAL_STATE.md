# WOS Calculator - Current State vs Ideal State

**Visual Comparison**: What exists vs what's missing  
**Generated**: December 27, 2025

---

## 📦 Feature Completeness

### Existing Calculators
```
✅ Charms Calculator
   ├─ Input: FROM/TO levels
   ├─ Output: Resource costs
   ├─ Features: Sortable table, profiles, translations
   └─ Status: COMPLETE & WORKING

✅ Chief Gear Calculator  
   ├─ Input: FROM/TO levels (multiple types)
   ├─ Output: Resource costs
   ├─ Features: Sortable table, profiles, translations
   └─ Status: COMPLETE & WORKING

✅ Fire Crystals Calculator
   ├─ Input: FROM/TO levels (8 buildings)
   ├─ Output: Resource costs
   ├─ Features: Zinman skill level, profiles, translations
   └─ Status: COMPLETE BUT DATA DUPLICATION ISSUE

✅ War Academy Calculator
   ├─ Input: Complex tech tree navigation
   ├─ Output: Research costs & power impact
   ├─ Features: Advanced UI, profiles, translations
   └─ Status: COMPLETE & COMPLEX (960 lines)

❌ Pets Calculator [PLACEHOLDER]
   ├─ Input: (none - placeholder only)
   ├─ Output: (none - placeholder only)
   ├─ Features: (none - placeholder only)
   └─ Status: MISSING (2-3 weeks work)

❌ Experts Calculator [PLACEHOLDER]
   ├─ Input: (none - placeholder only)
   ├─ Output: (none - placeholder only)
   ├─ Features: (none - placeholder only)
   └─ Status: MISSING (2-3 weeks work)
```

---

## 🔧 Core Systems

### Data Pipeline
```
🟢 PARTIAL:
├─ ✅ Excel source (resource_data.xlsx) - exists
├─ ✅ Extract scripts (scripts/extract-*.js) - exist
├─ ✅ CSV generation (assets/*_costs.csv) - working
├─ ⚠️  CSV loading (data-loader.js) - works but fragile
├─ ❌ Data validation after extraction - MISSING
├─ ❌ Extract error handling - MISSING
└─ ❌ Cache invalidation strategy - MISSING
```

### Error Handling
```
🔴 CRITICAL GAPS:
├─ ❌ CSV load failures - no user notification
├─ ❌ Input validation - no checks
├─ ❌ localStorage corruption - no recovery
├─ ❌ Calculation errors - no graceful fallback
├─ ❌ Network errors - silent fail
├─ ❌ Error monitoring - none (no Sentry)
└─ ❌ User notifications - very limited
```

### Profiles System
```
🟡 PARTIAL:
├─ ✅ Save to localStorage - works
├─ ✅ Load from localStorage - works
├─ ✅ Profile naming - works
├─ ✅ Delete profiles - works
├─ ⚠️  Rename profiles - works but could fail silently
├─ ❌ Export to JSON - MISSING
├─ ❌ Import from JSON - MISSING
├─ ❌ Bulk operations - MISSING
└─ ❌ Cloud backup - NOT PLANNED
```

### Performance
```
🟡 NEEDS WORK:
├─ ❌ Code minification - manual (not automated)
├─ ❌ Code splitting - not implemented
├─ ❌ Bundle optimization - not done
├─ ❌ CSV caching headers - not set
├─ ❌ CSS compression - exists but not auto
├─ ❌ Image optimization - not done
├─ ❌ Service worker caching - exists but minimal
└─ ⚠️  Build pipeline - no automated build
```

### Accessibility
```
🟡 PARTIAL:
├─ ✅ Semantic HTML - all pages
├─ ✅ ARIA labels - most elements
├─ ✅ Keyboard navigation - Tab/Enter works
├─ ✅ Screen reader tested - some pages
├─ ⚠️  Focus trap in modals - MISSING
├─ ⚠️  ARIA descriptions - incomplete
├─ ❌ Accessibility audit - not done
└─ ❌ WCAG 2.1 AA certification - not pursued
```

---

## 📊 Code Quality Scorecard

| Aspect | Current | Target | Gap |
|--------|---------|--------|-----|
| **Error Handling** | 20% | 90% | 70% |
| **Input Validation** | 10% | 95% | 85% |
| **Code Duplication** | 30% | 5% | 25% |
| **Test Coverage** | 0% | 80% | 80% |
| **Documentation** | 60% | 95% | 35% |
| **Performance** | 50% | 95% | 45% |
| **Accessibility** | 70% | 95% | 25% |
| **Security** | 40% | 90% | 50% |
| **Overall** | **41%** | **90%** | **49%** |

---

## 🔴 Critical Problems

### Data Consistency Risk
```
WHAT SHOULD HAPPEN:
Excel (Source) 
  ↓ npm run import:all
CSV (Generated)
  ↓ Runtime load
Calculator (Uses CSV)

WHAT'S HAPPENING:
Excel (Source)
  ├→ CSV (Generated)
  ├→ JavaScript Hardcoded Copy 1 (fire-crystals-calculator.js)
  └→ JavaScript Hardcoded Copy 2 (fallback somewhere?)
  
RESULT: 3 copies, 2 never get updated
RISK: User calculates with outdated costs
```

### Silent Failure Flow
```
❌ CURRENT:
User opens calculator
  ↓
CSV load fails
  ↓
loadCsv() returns { header: [], rows: [] }
  ↓
Calculator doesn't apply CSV override
  ↓
Uses hardcoded defaults (maybe outdated)
  ↓
User never knows ← PROBLEM!

✅ SHOULD BE:
CSV load fails
  ↓
Show notification: "⚠️ Could not load latest costs. Using defaults."
  ↓
User makes informed decision
```

### Input Validation Gaps
```
❌ CURRENT:
User enters "-50" in inventory
  ↓
No validation
  ↓
Profile saved with "-50"
  ↓
"Need -50 more meat" shown (nonsense)
  ↓
User confused

✅ SHOULD BE:
User enters "-50"
  ↓
Input validator catches negative
  ↓
Input marked invalid, shows error
  ↓
Profile only saves valid data
```

---

## 📈 Feature Parity Matrix

| Feature | Charms | Chief Gear | Fire Crystals | War Academy | Pets | Experts |
|---------|--------|-----------|---------------|-------------|------|---------|
| Calculator | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Results Table | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Sortable Columns | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Profiles Support | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Translations (8 langs) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| CSV Data Load | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Responsive Design | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Export Profile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Import Profile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dark/Light Theme | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Completion**: 4/6 full calculators (67%) ✅  
**Feature parity**: 8/9 features (89%) when counting only completed calculators  
**Remaining work**: 2 calculators + export/import

---

## 🎯 Ideal State Roadmap

### Phase 1: Stabilization (1.5 weeks)
```
Current State          Target State
━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━
❌ Silent failures     ✅ User notifications
❌ No validation      ✅ Input validators
❌ Data duplication   ✅ Single CSV source
❌ No recovery        ✅ localStorage backup
```

### Phase 2: Feature Completion (6-8 weeks)
```
Current State          Target State
━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━
❌ Pets placeholder   ✅ Pets calculator
❌ Experts placeholder ✅ Experts calculator
❌ No export        ✅ Export to JSON
❌ No import        ✅ Import from JSON
```

### Phase 3: Quality (4-6 weeks)
```
Current State          Target State
━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━
❌ No tests          ✅ E2E test suite
❌ Manual build      ✅ Automated build
❌ No code splitting ✅ Dynamic imports
❌ Large JS          ✅ Code splitting (-40% size)
```

### Phase 4: Polish (Ongoing)
```
Current State          Target State
━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━
❌ No analytics      ✅ Error monitoring
⚠️  Basic a11y       ✅ WCAG 2.1 AA
❌ No TypeScript     ✅ Type safety (optional)
❌ Limited filtering ✅ Advanced filters
```

---

## 📊 Project Health Timeline

```
     CRITICAL        HIGH           MEDIUM         NICE
     (1.5w)          (6-8w)         (4-6w)         (∞)
       |               |              |             |
NOW    v               v              v             v
───────●───────────────●──────────────●─────────────●─────────> TIME
       |
   Fire Crystals
   CSV Errors
   Validation
   localStorage

                      |
                  Pets/Experts
                  Export/Import
                  Data Pipeline

                                     |
                               Build Pipeline
                               Code Splitting
                               Testing

                                                  |
                                            Analytics
                                            TypeScript
                                            More features
```

---

## 💾 Database of Issues

### By Category

**Architecture** (3 issues)
- Fire Crystals duplication
- Data pipeline fragility
- Script load order (FIXED ✅)

**Data** (4 issues)
- CSV load failures
- Data validation missing
- Excel extraction fragile
- localStorage corruption

**Code Quality** (5 issues)
- Error handling weak
- Input validation missing
- Code duplication high
- Console logging inconsistent
- Documentation gaps

**Features** (6 issues)
- Pets calculator missing
- Experts calculator missing
- Profile export missing
- Profile import missing
- Table filtering missing
- Batch operations missing

**Performance** (4 issues)
- No automated build
- Code splitting missing
- CSV caching suboptimal
- Bundle size high

**Testing** (1 issue)
- No automated tests

**Security** (2 issues)
- localStorage corruption risk
- Input validation gaps

**Accessibility** (2 issues)
- Focus trap missing
- ARIA labels incomplete

**Total**: 27 distinct issues documented

---

## ⏱️ Time Breakdown (15-25 weeks)

```
Critical Issues          1.5 weeks  █████
High Priority           6-8 weeks  █████████████████████████
Medium Priority         4-6 weeks  ████████████████████
Nice-to-Have             Ongoing   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

Minimum effort:  15 weeks (developer working full-time on critical + high)
Realistic:       20 weeks (with some overlap, planning, testing)
With full team:  10-12 weeks (2-3 developers working in parallel)
```

---

## 🎯 Success Criteria

### Critical (Must Have)
- [ ] No silent data failures (CSV errors notified)
- [ ] Input validation prevents invalid data
- [ ] localStorage corruption recoverable
- [ ] Fire Crystals data consistency verified

### High Priority (Should Have)
- [ ] Pets & Experts calculators complete
- [ ] Profile export/import working
- [ ] Data extraction robust

### Medium Priority (Nice to Have)
- [ ] Automated build pipeline
- [ ] Code splitting implemented
- [ ] Basic E2E tests passing

### Nice-to-Have (Can Defer)
- [ ] TypeScript migration
- [ ] Advanced filtering
- [ ] Error monitoring (Sentry)

---

**Current Project Grade**: C+ (70%)  
**Potential Grade**: A (95%)  
**Time to A**: 15-25 weeks (depends on team size)


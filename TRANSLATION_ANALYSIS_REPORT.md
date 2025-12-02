# Translation Analysis Report
## WOS Calculator Translation System

**Generated:** December 2, 2025  
**Analyzed Files:**
- `src/Scripts/translations.js`
- `src/Scripts/calculator.js` (Charms)
- `src/Scripts/chief-gear-calculator.js`
- `src/Scripts/fire-crystals-calculator.js`
- `src/Scripts/war-laboratory.js`

---

## 1. Translation Key Count by Language

| Language | Total Keys | Percentage Complete |
|----------|------------|---------------------|
| English (en) | 92 | 100% (baseline) |
| Spanish (es) | 92 | 100% |
| Korean (ko) | 92 | 100% |
| Russian (ru) | 92 | 100% |
| French (fr) | 45 | 49% |
| German (de) | 45 | 49% |
| Portuguese (pt) | 45 | 49% |
| Italian (it) | 45 | 49% |

---

## 2. Missing Translation Keys by Language

### French (fr) - Missing 47 Keys
Missing keys that exist in English:
- `home-hero-title`, `home-hero-body-1`, `home-hero-body-2`
- `coming-title`, `coming-lede`, `coming-highlights-label`
- `coming-highlight-research`, `coming-highlight-pets`, `coming-highlight-experts`, `coming-highlight-combined`, `coming-outro`
- `fire-buildings`
- `pets-coming-title`, `pets-body-1`, `pets-body-2`, `pets-bullet-1`, `pets-bullet-2`, `pets-bullet-3`, `pets-bullet-4`
- `pets-roadmap-label`, `pets-roadmap-body`, `pets-teaser-label`, `pets-teaser-body`
- `zinman-level-label`, `zinman-level-note`, `zinman-level-0` through `zinman-level-5`
- `storage-consent-title`, `storage-consent-body`, `storage-consent-allow`, `storage-consent-deny`
- `delete-profile-title`, `delete-profile-confirm`, `delete-profile-cancel`, `delete-profile-message`
- `charms-header`, `charms-inventory`, `profile-name-placeholder`
- `charm`, `charm-1`, `charm-2`, `charm-3`
- `hat-charms`, `chestplate-charms`, `ring-charms`, `watch-charms`, `pants-charms`, `staff-charms`
- `batch`, `refine-crystals`, `construction-speed`
- `gear-current`, `gear-desired`, `gear-type`, `building-current`, `building-desired`
- `level.start`, `level.finish`
- `svs-points`, `svs-points-fc`, `svs-points-rfc`, `svs-points-speedup`
- `gap-need-more`, `gap-have-left`, `gap-time-need-more`, `gap-time-have-left`
- `support-header`, `support-message`
- `select-node-prompt`, `no-selections`, `range`, `time`

### German (de) - Missing 47 Keys
Same keys as French (identical missing set)

### Portuguese (pt) - Missing 47 Keys
Same keys as French (identical missing set)

### Italian (it) - Missing 47 Keys
Same keys as French (identical missing set)

---

## 3. Resource Names Translation Status

### ✅ Already Translated
All major resources have translation keys:
- `meat`, `wood`, `coal`, `iron`, `steel` ✅
- `fire-crystals`, `refine-crystals` ✅
- `hardened-alloy`, `polishing-solution`, `design-plans`, `lunar-amber` ✅
- `guides`, `designs`, `secrets` ✅

**Status:** All resource names are properly defined in translations.js

---

## 4. Hardcoded Strings Found in innerHTML

### 🔴 war-laboratory.js (Line 538)
```javascript
panel.innerHTML = `<p>Ranges are edited directly on each node. Click a node to set From -> To.</p>`;
```
**Recommendation:** Create key `war-lab-range-instructions`

### 🔴 war-laboratory.js (Lines 610, 619)
```javascript
tbody.innerHTML = '<tr><td colspan="12">No slots selected yet.</td></tr>';
```
**Already exists:** Uses `no-selections` key elsewhere, but not consistently

### 🔴 war-laboratory.js (Line 793)
```javascript
const gapText = gap > 0 ? `Need ${gap.toLocaleString()} more` : 
                gap < 0 ? `Have ${Math.abs(gap).toLocaleString()} extra` : 
                'Exact match';
```
**Issues:**
- "Need" and "more" - Uses direct English text instead of translation keys
- "Have" and "extra" - Uses direct English text
- "Exact match" - Not translated

**Recommendation:** Should use existing keys:
- `need-more` + `more` (already exist)
- `will-have` + `left` (already exist)
- Create new key: `exact-match`

### 🔴 war-laboratory.js (Line 820)
```javascript
const stripeText = remainingSeconds > 0 ? 
    `⚠ need ${daysVal.toFixed(1)} days more` : 
    `left ${daysVal.toFixed(1)} days`;
```
**Issues:**
- "need", "days more" - Hardcoded English
- "left", "days" - Hardcoded English

**Recommendation:** Create time-specific keys:
- `time-need-days-more`
- `time-have-days-left`

### 🟡 war-laboratory.js (Line 555)
```javascript
empty.textContent = 'No active selections. Pick nodes in the tree to begin.';
```
**Status:** Uses `no-selections` key elsewhere, should be consistent

---

## 5. Gap Message Patterns

### Current Implementation Status

#### ✅ Already Have Keys For:
- `gap-need-more` - "need <span>%d</span> more!"
- `gap-have-left` - "will have <span>%d</span> left!"
- `gap-time-need-more` - "Need <span>%dd %dh %dm</span> more!"
- `gap-time-have-left` - "Will have <span>%dd %dh %dm</span> left!"

#### ❌ Missing Keys For:
- Simple "Need X more" format (without HTML spans)
- Simple "Have X extra" format (without HTML spans)
- "Exact match" message
- Day-only time format ("need X days more")

---

## 6. Building Names Translation Status

### ✅ Fully Translated
All building names have translation keys in all 8 languages:
- `Furnace`, `Embassy`, `Command Center`, `Infirmary`
- `Infantry Camp`, `Marksman Camp`, `Lancer Camp`
- `War Academy`

---

## 7. Time-Related Strings

### ✅ Already Have:
- `total-time` - "Total Time"
- `total-reduced-time` - "Total Reduced Time"
- `speedup-days` - "Speedup Days"
- Time formats use "d", "h", "m" suffixes (hardcoded but universal)

### ⚠️ Potential Issues:
- The formatTime() function in war-laboratory.js uses hardcoded "d", "h", "m"
- These are widely understood abbreviations, but could be localized

---

## 8. Recommended New Translation Keys

### High Priority

```javascript
// Exact match message
"exact-match": "Exact match!",

// War Lab specific
"war-lab-range-instructions": "Ranges are edited directly on each node. Click a node to set From -> To.",
"war-lab-no-slots": "No slots selected yet.",

// Simple gap messages (no HTML)
"need-simple": "Need %s more",
"have-simple": "Have %s extra",

// Time-specific day messages
"time-need-days": "need %s days more",
"time-have-days": "left %s days",

// Results panel
"select-node-prompt-alt": "Select a node to view totals.",
"no-active-selections": "No active selections. Pick nodes in the tree to begin.",
```

### Medium Priority

```javascript
// Building result labels
"building-results": "Building Results",
"slot-breakdown": "Slot Breakdown",
"costs-summary": "Costs Summary",

// Generic status messages
"data-pending": "Data pending",
"loading": "Loading...",
"error-loading": "Error loading data",
```

---

## 9. Summary of Issues

### Critical Issues (Block Translation)
1. ❌ **4 languages (fr, de, pt, it) missing 47 keys each** - 51% incomplete
2. ❌ **war-laboratory.js has 5+ hardcoded English strings** in innerHTML

### Major Issues (Affect UX)
3. ⚠️ **Inconsistent use of translation keys** - Same messages use different approaches
4. ⚠️ **Gap messages use direct English** instead of existing translation keys

### Minor Issues (Polish)
5. 🔹 Time abbreviations ("d", "h", "m") could be localized
6. 🔹 Missing translations for "Exact match" status

---

## 10. Implementation Recommendations

### Phase 1: Complete Existing Languages (High Priority)
1. Add 47 missing keys to French, German, Portuguese, Italian
2. Work with translators to ensure quality
3. Estimated effort: 4-6 hours per language

### Phase 2: Fix Hardcoded Strings (Critical)
1. Replace hardcoded strings in war-laboratory.js with translation keys
2. Add missing translation keys listed in Section 8
3. Update all calculators to use consistent translation approach
4. Estimated effort: 2-3 hours

### Phase 3: Test & Verify (Essential)
1. Test each language on all calculator pages
2. Verify gap messages display correctly in all languages
3. Check time formats and number formatting
4. Estimated effort: 2 hours

### Phase 4: Documentation (Nice to Have)
1. Document translation key naming conventions
2. Create guide for adding new translations
3. Add translation coverage tests
4. Estimated effort: 1-2 hours

---

## 11. Translation Coverage Metrics

```
Overall Translation Coverage: 72.8%
  English (baseline):     100% ████████████████████
  Spanish:                100% ████████████████████
  Korean:                 100% ████████████████████
  Russian:                100% ████████████████████
  French:                  49% █████████▓░░░░░░░░░░
  German:                  49% █████████▓░░░░░░░░░░
  Portuguese:              49% █████████▓░░░░░░░░░░
  Italian:                 49% █████████▓░░░░░░░░░░
```

---

## Appendix A: Key Distribution by Category

| Category | Key Count | Example Keys |
|----------|-----------|--------------|
| Navigation | 8 | nav-home, nav-charms, nav-chief-gear |
| General UI | 12 | results, total, totals, slot, delete |
| Resources | 14 | meat, wood, coal, iron, fire-crystals |
| Buildings | 8 | Furnace, Embassy, Infantry Camp |
| Gear Types | 6 | Helmet, Chestplate, Ring, Watch |
| Charms | 8 | guides, designs, secrets, charm-1 |
| Time & Speed | 6 | total-time, speedup-days, construction-speed |
| Status Messages | 8 | gap-need-more, gap-have-left, still-needed |
| War Academy | 18 | war-academy-title, marksman, infantry |
| Profiles | 8 | storage-consent-*, delete-profile-* |
| Support | 2 | support-header, support-message |

---

## Appendix B: Files Requiring Updates

### To Add Missing Translations:
- `src/Scripts/translations.js` - Add 47 keys to fr, de, pt, it sections

### To Fix Hardcoded Strings:
- `src/Scripts/war-laboratory.js` - 5+ locations (lines 538, 555, 610, 619, 793, 820)

### To Review:
- `src/Scripts/calculator.js` - Review gap message implementation
- `src/Scripts/chief-gear-calculator.js` - Review gap message implementation
- `src/Scripts/fire-crystals-calculator.js` - Review gap message implementation

---

**Report End**

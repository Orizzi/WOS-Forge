# Translation System - Quick Reference

Quick lookup guide for developers working with the WOS Calculator translation system.

---

## Basic Usage

### Static HTML Translation

```html
<!-- Label -->
<label data-i18n="from">FROM:</label>

<!-- Button -->
<button data-i18n="save">Save</button>

<!-- Heading -->
<h3 data-i18n="results-title">Results</h3>
```

### Dynamic JavaScript Translation

```javascript
// Simple
const text = t('total-power');

// With language
const text = t('total-power', { lang: 'es' });

// With variables
const text = t('greeting', { vars: { name: 'John' } });

// With count
const text = t('items', { count: 5 });
```

---

## Enhanced Features (v2.0)

### Variable Interpolation

```javascript
// Translation
en: { "welcome": "Hello {{name}}, you have {{count}} items" }

// Usage
t('welcome', { vars: { name: 'John', count: 5 } });
// Output: "Hello John, you have 5 items"
```

### Pluralization

```javascript
// Translation
en: {
    "items": {
        "zero": "No items",
        "one": "1 item",
        "other": "{{count}} items"
    }
}

// Usage
t('items', { count: 0 });   // "No items"
t('items', { count: 1 });   // "1 item"
t('items', { count: 5, vars: { count: 5 } });   // "5 items"
```

### Context-Aware

```javascript
// Translation
en: {
    "close": {
        "button": "Close",
        "proximity": "Nearby"
    }
}

// Usage
t('close', { context: 'button' });      // "Close"
t('close', { context: 'proximity' });   // "Nearby"
```

---

## API Functions

### Core Functions

```javascript
// Translate key
window.I18n.t(key, options)

// Get current language
window.I18n.getCurrentLanguage()  // Returns: "en", "es", etc.

// Apply translations to DOM
window.I18n.applyTranslations('es')
```

### Developer Utilities (v2.0)

```javascript
// Get missing translations
window.I18n.getMissingTranslations()
// Returns: ["es:key1", "ko:key2"]

// Get statistics
window.I18n.getTranslationStats()
// Returns: { languages: 8, totalKeys: 245, ... }

// Clear tracking
window.I18n.clearMissingTranslations()

// Validate translations
window.I18n.validateTranslations()
```

---

## Debugging

### Check Missing Translations

```javascript
// Run after using features
const missing = window.I18n.getMissingTranslations();
console.log('Missing:', missing);

// Group by language
const byLang = {};
missing.forEach(item => {
    const [lang, key] = item.split(':');
    if (!byLang[lang]) byLang[lang] = [];
    byLang[lang].push(key);
});
console.table(byLang);
```

### Check Statistics

```javascript
const stats = window.I18n.getTranslationStats();
console.log(`Coverage: ${stats.totalKeys - stats.missingCount}/${stats.totalKeys}`);
```

### Validate All Translations

```javascript
// Automatically checks all languages
window.I18n.validateTranslations();

// Check console for warnings:
// [I18n] Missing translation keys detected:
//   es: 3 missing keys
//   ko: 5 missing keys
```

---

## Adding Translations

### Step 1: Add to English

```javascript
// In translations.js
en: {
    "new-feature": "Advanced Analytics"
}
```

### Step 2: Add to All Languages

```javascript
es: { "new-feature": "Análisis Avanzado" },
ko: { "new-feature": "고급 분석" },
ru: { "new-feature": "Расширенная аналитика" },
fr: { "new-feature": "Analyses avancées" },
de: { "new-feature": "Erweiterte Analytik" },
pt: { "new-feature": "Análise Avançada" },
it: { "new-feature": "Analisi Avanzate" }
```

### Step 3: Use

```html
<!-- HTML -->
<h3 data-i18n="new-feature">Advanced Analytics</h3>
```

```javascript
// JavaScript
const title = t('new-feature');
```

### Step 4: Validate

```javascript
window.I18n.validateTranslations();
const missing = window.I18n.getMissingTranslations();
```

---

## Common Patterns

### Results Table

```javascript
function renderResults(data) {
    return `
        <table>
            <thead>
                <tr>
                    <th>${t('building')}</th>
                    <th>${t('from')}</th>
                    <th>${t('to')}</th>
                    <th>${t('total-cost')}</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>
                        <td>${t(row.building)}</td>
                        <td>${row.from}</td>
                        <td>${row.to}</td>
                        <td>${formatNumber(row.cost)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
```

### Dynamic Messages

```javascript
// With variables
function showGap(resource, amount) {
    return t('gap-message', {
        vars: {
            resource: t(resource),
            amount: formatNumber(amount)
        }
    });
}

// With pluralization
function showItemCount(count) {
    return t('items-selected', { 
        count: count,
        vars: { count: count }
    });
}
```

### Cached Translations in Loops

```javascript
// Cache before loop
const fromLabel = t('from');
const toLabel = t('to');

// Use in loop
buildings.forEach(building => {
    html += `
        <div>
            <label>${fromLabel}</label>
            <select>${buildOptions()}</select>
            <label>${toLabel}</label>
            <select>${buildOptions()}</select>
        </div>
    `;
});
```

---

## Troubleshooting

### Translation Not Appearing

```javascript
// 1. Check if key exists
console.log(window.I18n.translations.en['your-key']);

// 2. Verify current language
console.log(window.I18n.getCurrentLanguage());

// 3. Check for typos
console.log(Object.keys(window.I18n.translations.en));
```

### Variables Not Interpolating

```javascript
// ❌ Wrong
t('greeting', { name: 'John' });

// ✅ Correct
t('greeting', { vars: { name: 'John' } });
```

### Pluralization Not Working

```javascript
// ❌ Wrong - missing count
t('items', { vars: { count: 5 } });

// ✅ Correct - include count parameter
t('items', { count: 5, vars: { count: 5 } });
```

---

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| es | Spanish | Español |
| ko | Korean | 한국어 |
| ru | Russian | Русский |
| fr | French | Français |
| de | German | Deutsch |
| pt | Portuguese | Português |
| it | Italian | Italiano |

---

## Console Commands

```javascript
// Switch language
window.I18n.applyTranslations('es');

// Get stats
window.I18n.getTranslationStats();

// Find missing
window.I18n.getMissingTranslations();

// Validate
window.I18n.validateTranslations();

// Clear tracker
window.I18n.clearMissingTranslations();

// Check specific translation
window.I18n.translations.es['your-key'];

// List all keys
Object.keys(window.I18n.translations.en);
```

---

## Files

- **Source:** `src/Scripts/translations.js`
- **Documentation:** `docs/TRANSLATION_SYSTEM.md`
- **Upgrades:** `docs/TRANSLATION_UPGRADES.md`

---

*Quick reference for WOS Calculator translation system v2.0*

# WOS Calculator - Project TODO & Improvement Roadmap

> **Generated**: 2025-01-XX  
> **Project Version**: 2.1.0  
> **Last Major Release**: Translation Phase 1 + Responsive Layout Fixes

This document categorizes all potential improvements, upgrades, and new features for the Whiteout Survival Calculator project. Items are prioritized by impact and feasibility.

---

## 📋 Table of Contents

1. [🎯 High Priority - Core Features](#-high-priority---core-features)
2. [⚡ Performance Optimizations](#-performance-optimizations)
3. [🎨 UX/UI Enhancements](#-uxui-enhancements)
4. [🔧 Code Quality & Maintainability](#-code-quality--maintainability)
5. [🌍 Translation System (Phases 2-5)](#-translation-system-phases-2-5)
6. [📱 Mobile & PWA Features](#-mobile--pwa-features)
7. [📊 Analytics & Monitoring](#-analytics--monitoring)
8. [🔒 Security & Validation](#-security--validation)
9. [🚀 Deployment & CI/CD](#-deployment--cicd)
10. [📚 Documentation Improvements](#-documentation-improvements)
11. [🧪 Testing Infrastructure](#-testing-infrastructure)
12. [♿ Accessibility Compliance](#-accessibility-compliance)
13. [🔍 SEO & Discoverability](#-seo--discoverability)
14. [💾 Data Pipeline Enhancements](#-data-pipeline-enhancements)
15. [🎁 Nice-to-Have Features](#-nice-to-have-features)

---

## 🎯 High Priority - Core Features

### Pending Calculator Implementations

#### **PETS-001**: Pets Calculator (Coming Soon Page Exists)
- **Status**: Placeholder page created (`src/pets.html`)
- **Requirements**:
  - Pet feeding cost calculations (food resources)
  - Evolution path tracking (stages/tiers)
  - Synergy tracking between pets
  - Power impact calculations for fully evolved companions
  - Integration with unified profiles system
- **Files to Create**:
  - `src/Scripts/pets-calculator.js` (~800 lines estimated)
  - `src/assets/pets_costs.csv` (data extraction)
  - `scripts/extract-pets-costs.js` (Excel → CSV)
- **Dependencies**:
  - Excel sheet: `resource_data.xlsx` needs "Pets Data" sheet
  - Icons: `src/assets/resources/pets/` folder
  - Translations: Add ~30 keys to `translations.js` (all 8 languages)
- **Effort**: Medium-High (2-3 weeks)
- **References**: `docs/CALCULATOR_PAGE_TEMPLATE.md`, `docs/New Calculator Page Checklist.md`

#### **PETS-002**: Pets Data Sheet Creation
- **Action**: Add "Pets Data" sheet to `resource_data.xlsx`
- **Columns**: Pet Name, Level/Stage, Food Cost, Power Gained, Evolution Requirements
- **Research**: Gather accurate game data from community/wiki
- **Effort**: Low (3-5 days research + data entry)

---

#### **EXPERTS-001**: Experts Calculator (Coming Soon Page Exists)
- **Status**: Placeholder page created (`src/experts.html`)
- **Requirements**:
  - Expert upgrade cost calculations
  - Skill level tracking
  - Talent tree path optimization
  - Power impact per expert level
  - Integration with unified profiles system
- **Files to Create**:
  - `src/Scripts/experts-calculator.js` (~700 lines estimated)
  - `src/assets/experts_costs.csv` (data extraction)
  - `scripts/extract-experts-costs.js` (Excel → CSV)
- **Dependencies**:
  - Excel sheet: `resource_data.xlsx` needs "Experts Data" sheet
  - Icons: `src/assets/resources/experts/` folder
  - Translations: Add ~25 keys to `translations.js` (all 8 languages)
- **Effort**: Medium (2-3 weeks)
- **References**: Same as PETS-001

#### **EXPERTS-002**: Experts Data Sheet Creation
- **Action**: Add "Experts Data" sheet to `resource_data.xlsx`
- **Columns**: Expert Name, Skill Level, Upgrade Costs, Power Gained, Talent Points
- **Research**: Gather accurate game data from community/wiki
- **Effort**: Low (3-5 days research + data entry)

---

### Feature Enhancements for Existing Calculators

#### **CALC-001**: Profile Export/Import to JSON
- **Current State**: Profiles stored in localStorage only (no backup/transfer)
- **Requirements**:
  - Export current profile to `.json` file (download)
  - Import profile from `.json` file (upload)
  - Validation to prevent corrupted data
  - Version compatibility checks (migration support)
- **Files to Modify**:
  - `src/Scripts/profiles.js` - Add `exportProfile()`, `importProfile()`, `validateProfileJson()`
  - Add UI buttons in profile sections across all calculators
- **Benefits**: Backup, sharing, cross-device synchronization
- **Effort**: Low-Medium (1 week)
- **Priority**: High (frequently requested)

#### **CALC-002**: Advanced Filtering in Results Tables
- **Current State**: Tables sortable by column only
- **Requirements**:
  - Filter by resource type (e.g., show only "Guides" rows)
  - Search within table (filter by keyword)
  - Range filters (e.g., "Show upgrades costing 1000-5000 Guides")
  - Export filtered results to CSV
- **Files to Modify**:
  - `src/Scripts/table-sort.js` - Add filtering API
  - Update all calculator modules to support filtering
- **Effort**: Medium (1-2 weeks)
- **Priority**: Medium

#### **CALC-003**: Batch Profile Operations
- **Current State**: Can only load/save/delete one profile at a time
- **Requirements**:
  - Select multiple profiles for deletion
  - Duplicate existing profile
  - Merge profiles (combine resource needs from multiple plans)
  - Bulk export selected profiles
- **Files to Modify**:
  - `src/Scripts/profiles.js` - Extend with batch operations API
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low

---

## ⚡ Performance Optimizations

#### **PERF-001**: Code Splitting & Lazy Loading
- **Current State**: All JavaScript loaded on every page (unnecessary overhead)
- **Requirements**:
  - Load calculator-specific JS only when needed (not on index.html)
  - Lazy load translations for non-active languages
  - Dynamic import() for heavy modules (fire-crystals-calculator.js is 1234 lines)
- **Implementation**:
  ```javascript
  // Example: Dynamic calculator loading
  if (document.getElementById('charms-calculator')) {
    import('./Scripts/calculator.js').then(module => module.init());
  }
  ```
- **Expected Gains**: ~40% reduction in initial load time
- **Effort**: Medium-High (2 weeks)
- **Priority**: High

#### **PERF-002**: Minification & Bundle Optimization
- **Current State**: Minified files exist but not systematically used/generated
- **Actions**:
  - Add build script to minify all JS/CSS automatically
  - Use Rollup or Webpack for bundling
  - Tree-shaking unused code
  - Compress images (lossy compression for icons)
- **Files**:
  - Add `scripts/build.js` or configure bundler
  - Update `package.json` with build commands
  - Update `netlify.toml` to use minified files in production
- **Expected Gains**: ~50% reduction in bundle size
- **Effort**: Medium (1-2 weeks)
- **Priority**: High

#### **PERF-003**: CSV Caching Strategy
- **Current State**: CSVs fetched on every page load (no browser caching headers)
- **Requirements**:
  - Add Cache-Control headers for CSV files (1 hour cache)
  - Implement ETag support to detect changed CSVs
  - Add version hash to CSV URLs (e.g., `charms_costs.csv?v=abc123`)
- **Implementation**:
  - Update `data-loader.js` to handle versioned URLs
  - Add cache busting logic when new data extracted
- **Expected Gains**: 90% reduction in repeat CSV fetch time
- **Effort**: Low (3-5 days)
- **Priority**: Medium

#### **PERF-004**: Web Workers for Heavy Calculations
- **Current State**: All calculations run on main thread (can block UI)
- **Use Cases**:
  - Fire Crystals calculator with 10 buildings × 30 levels = 300 calculations
  - Profile validation with large datasets
  - Translation validation across 8 languages
- **Implementation**:
  - Create `src/Scripts/workers/calculation-worker.js`
  - Offload `CalculationCore.compute()` to worker
- **Expected Gains**: Smoother UI, no freezing on heavy operations
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (current calculations fast enough)

#### **PERF-005**: Virtual Scrolling for Large Tables
- **Current State**: All rows rendered simultaneously (performance hit with 100+ rows)
- **Requirements**:
  - Render only visible rows + buffer
  - Dynamically add/remove rows as user scrolls
  - Maintain sorting/filtering compatibility
- **Libraries**: Consider `react-window` or vanilla implementation
- **Effort**: High (3-4 weeks)
- **Priority**: Low (only needed if tables exceed 500+ rows)

---

## 🎨 UX/UI Enhancements

#### **UX-001**: Loading States & Spinners
- **Current State**: Silent loading (no feedback when fetching CSVs or calculating)
- **Requirements**:
  - Add spinner/skeleton screens during CSV load
  - Progress indicators for long calculations
  - Toast notifications for successful saves/deletes
- **Implementation**:
  - Create `src/Scripts/ui-feedback.js` module
  - Add CSS animations for loaders
  - Integrate with all async operations
- **Effort**: Low (1 week)
- **Priority**: High (improves perceived performance)

#### **UX-002**: Smooth Animations & Transitions
- **Current State**: Instant state changes (theme toggle, profile switch)
- **Requirements**:
  - Fade-in/fade-out transitions (theme change, modal open/close)
  - Slide animations for profile list updates
  - Smooth table row highlighting on hover
  - Micro-interactions (button press animations)
- **Implementation**:
  - Add CSS transitions to `style.css`
  - Use `prefers-reduced-motion` media query for accessibility
- **Effort**: Low (3-5 days)
- **Priority**: Medium

#### **UX-003**: Enhanced Error Handling
- **Current State**: Console warnings/errors not visible to users
- **Requirements**:
  - User-friendly error messages (instead of technical console.warn)
  - Fallback UI when CSV fails to load (show default data notice)
  - Validation errors displayed inline (e.g., "Invalid level range: FROM must be ≤ TO")
  - Retry mechanism for failed network requests
- **Files to Create**:
  - `src/Scripts/error-handler.js` - Centralized error display
- **Effort**: Medium (1-2 weeks)
- **Priority**: High

#### **UX-004**: Contextual Help & Tooltips
- **Current State**: No in-app help or explanations
- **Requirements**:
  - Tooltip on hover for unclear labels (e.g., "What are SVS Points?")
  - Help icons (❓) next to complex inputs
  - Onboarding tour for first-time users (optional walkthrough)
  - FAQ section in each calculator
- **Implementation**:
  - Add `data-tooltip` attributes to HTML elements
  - Create CSS tooltip component (pure CSS, no library)
  - Optional: Integrate library like `Tippy.js` for rich tooltips
- **Effort**: Medium (1-2 weeks)
- **Priority**: Medium

#### **UX-005**: Dark/Light Theme Improvements
- **Current State**: Two themes exist, well-implemented
- **Enhancements**:
  - Add "Auto" theme (respect system preference)
  - Theme preview before applying (show sample in modal)
  - Custom theme builder (user picks accent color)
  - High contrast mode for accessibility
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (current themes sufficient)

#### **UX-006**: Keyboard Shortcuts
- **Current State**: Full keyboard navigation exists but no shortcuts
- **Requirements**:
  - `Ctrl+S` to save profile
  - `Ctrl+N` to create new profile
  - `Ctrl+L` to load profile
  - `Ctrl+E` to export profile (when CALC-001 implemented)
  - `Esc` to close modals (already works)
  - Display shortcut hints in UI (e.g., button tooltip shows "Save (Ctrl+S)")
- **Effort**: Low (3-5 days)
- **Priority**: Low (nice-to-have)

#### **UX-007**: Sticky Headers for Long Tables
- **Current State**: Headers scroll out of view on long tables
- **Requirements**:
  - Keep table headers fixed at top when scrolling
  - Maintain column alignment
  - Works on mobile (tricky with horizontal scroll)
- **Implementation**:
  - Add `position: sticky; top: 0;` to `<thead>`
  - Test cross-browser compatibility
- **Effort**: Low (2-3 days)
- **Priority**: Medium

---

## 🔧 Code Quality & Maintainability

#### **CODE-001**: TypeScript Migration (Long-Term)
- **Current State**: Vanilla JavaScript (no type safety)
- **Benefits**:
  - Catch bugs at compile-time (e.g., wrong function parameters)
  - Better IDE autocomplete
  - Safer refactoring
  - Improved documentation (types as documentation)
- **Migration Strategy**:
  1. Convert one module at a time (start with `data-loader.js`)
  2. Use `.d.ts` declaration files for gradual adoption
  3. Configure `tsconfig.json` for strict mode
- **Effort**: High (3-4 months for full migration)
- **Priority**: Low (major undertaking, but high long-term value)

#### **CODE-002**: Unit Testing Framework
- **Current State**: No automated tests (manual testing only)
- **Requirements**:
  - Set up Jest or Mocha + Chai
  - Test calculation logic (charms costs, fire crystals time estimates)
  - Test profile save/load/migrate functions
  - Test translation interpolation and pluralization
  - Mock localStorage for tests
  - Aim for 70%+ code coverage
- **Files to Create**:
  - `tests/` directory
  - `tests/calculator.test.js`, `tests/profiles.test.js`, etc.
  - Add `npm test` script to `package.json`
- **Effort**: High (2-3 weeks to set up + write tests)
- **Priority**: Medium (critical for maintainability)

#### **CODE-003**: End-to-End Testing (E2E)
- **Current State**: No automated UI tests
- **Requirements**:
  - Use Playwright or Cypress
  - Test user flows:
    - Create profile → Save → Load → Verify data restored
    - Change levels → Verify results table updates
    - Switch theme → Verify colors change
    - Switch language → Verify translations applied
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (manual testing sufficient for now)

#### **CODE-004**: Linting Expansion (JavaScript)
- **Current State**: Only CSS linted (Stylelint)
- **Requirements**:
  - Add ESLint for JavaScript
  - Configure rules: `eslint:recommended`, `airbnb-base`
  - Enforce coding standards (consistent quotes, indentation, etc.)
  - Add pre-commit hooks (Husky + lint-staged)
- **Files to Create**:
  - `.eslintrc.json`
  - `.eslintignore`
  - Update `package.json` with `lint:js` script
- **Effort**: Low (1 week)
- **Priority**: Medium

#### **CODE-005**: Code Documentation (JSDoc)
- **Current State**: Minimal inline comments, no structured API docs
- **Requirements**:
  - Add JSDoc comments to all public functions
  - Generate HTML documentation with `jsdoc` or `typedoc`
  - Document complex algorithms (e.g., Fire Crystals time estimation logic)
  - Add examples in comments
- **Example**:
  ```javascript
  /**
   * Calculates total charm upgrade cost.
   * @param {number} fromLevel - Starting level (0-15)
   * @param {number} toLevel - Target level (0-15)
   * @returns {{guides: number, designs: number, secrets: number, power: number}} Total resources needed
   * @throws {Error} If fromLevel > toLevel
   * @example
   * const cost = calculateCharmCost(5, 10);
   * console.log(cost.guides); // 3500
   */
  function calculateCharmCost(fromLevel, toLevel) { ... }
  ```
- **Effort**: Medium (2-3 weeks)
- **Priority**: Medium

#### **CODE-006**: Refactor Fire Crystals Calculator
- **Current State**: `fire-crystals-calculator.js` is 1234 lines (too large, hard to maintain)
- **Requirements**:
  - Split into smaller modules:
    - `fire-crystals-core.js` - Calculation logic
    - `fire-crystals-ui.js` - DOM manipulation
    - `fire-crystals-time.js` - Time estimation
  - Follow single responsibility principle
  - Improve readability (extract magic numbers to constants)
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (works fine, but tech debt)

#### **CODE-007**: Dependency Audit & Update
- **Current State**: Dependencies installed but not regularly updated
- **Actions**:
  - Run `npm audit` monthly (check for vulnerabilities)
  - Update dependencies quarterly (test for breaking changes)
  - Remove unused dependencies (if any)
  - Document why each dependency exists (in README or docs)
- **Effort**: Low (ongoing maintenance task)
- **Priority**: High (security)

---

## 🌍 Translation System (Phases 2-5)

> **Note**: Phase 1 completed in v2.0 (variable interpolation, pluralization, context-aware translations)

#### **I18N-001**: Phase 2 - Namespaces (Q1 2026)
- **Requirements**:
  - Group translations by feature (e.g., `charms.*, profiles.*, errors.*`)
  - Lazy load namespaces (only load translations needed for current page)
  - Reduce initial bundle size for translations.js (currently ~1800 lines)
- **Implementation**:
  - Refactor `translations.js` to export separate objects per namespace
  - Update `t(key)` to support dotted keys: `t('charms.header')`
  - Load namespaces dynamically: `I18n.loadNamespace('charms')`
- **Effort**: Medium (2-3 weeks)
- **Priority**: Medium
- **Reference**: `docs/TRANSLATION_UPGRADES.md` lines 665-739

#### **I18N-002**: Phase 3 - Advanced Pluralization (Q2 2026)
- **Requirements**:
  - Use `Intl.PluralRules` API for complex plural forms
  - Support languages with >2 plural forms (Russian: zero/one/few/many/other)
  - Ordinal plurals (1st, 2nd, 3rd vs 1., 2., 3.)
- **Implementation**:
  - Enhance `t()` function to use `Intl.PluralRules`
  - Add `ordinal` option to `t()` for ordinal numbers
- **Effort**: Low-Medium (1-2 weeks)
- **Priority**: Low (simple pluralization sufficient for now)
- **Reference**: `docs/TRANSLATION_UPGRADES.md` lines 741-804

#### **I18N-003**: Phase 4 - Lazy Loading (Q3 2026)
- **Requirements**:
  - Load translation files on-demand (not all 8 languages upfront)
  - Fetch language JSON only when user switches language
  - Cache loaded languages in memory (no re-fetch)
- **Implementation**:
  - Convert `translations.js` from static object to dynamic loader
  - Store translations in separate JSON files: `lang/en.json`, `lang/es.json`, etc.
  - Update `I18n.setLanguage()` to fetch JSON if not cached
- **Effort**: Medium (2-3 weeks)
- **Priority**: Low (performance gain minimal for 8 languages)
- **Reference**: `docs/TRANSLATION_UPGRADES.md` lines 806-877

#### **I18N-004**: Phase 5 - Translation Editor (Q4 2026)
- **Requirements**:
  - In-browser translation management tool
  - Edit translations without touching code
  - Export to JSON for commit
  - Visual preview of changes (see translation applied live)
- **Implementation**:
  - Create `translation-editor.html` page (admin tool)
  - Build UI to edit all 245+ keys across 8 languages
  - Add validation (no empty strings, HTML entity checks)
- **Effort**: High (4-6 weeks)
- **Priority**: Low (developer convenience, not user-facing)
- **Reference**: `docs/TRANSLATION_UPGRADES.md` lines 879-978

#### **I18N-005**: Add More Languages
- **Current State**: 8 languages (EN, ES, KO, RU, FR, DE, PT, IT)
- **Candidates**: Chinese (ZH), Japanese (JA), Turkish (TR), Arabic (AR)
- **Requirements**:
  - Recruit translators (community-driven)
  - Add 245 keys × 4 languages = 980 new translations
  - Test RTL layout for Arabic
- **Effort**: Low per language (translation work outsourced)
- **Priority**: Low (current 8 languages cover majority)

---

## 📱 Mobile & PWA Features

#### **PWA-001**: Enhanced PWA Manifest
- **Current State**: Basic `manifest.json` exists
- **Enhancements**:
  - Add multiple icon sizes (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
  - Add screenshots for app listing (mobile/desktop)
  - Add categories ("utilities", "games")
  - Add shortcuts (jump to specific calculator from home screen icon)
- **Files to Update**:
  - `src/manifest.json`
  - Create high-quality icons (not just banner resized)
- **Effort**: Low (2-3 days)
- **Priority**: Medium

#### **PWA-002**: Offline Mode Improvements
- **Current State**: Service worker exists (v10), caches core files
- **Enhancements**:
  - Cache CSVs for offline use
  - Show offline indicator when network unavailable
  - Queue profile saves when offline, sync when online
  - Background sync API for profile backups
- **Files to Update**:
  - `src/service-worker.js`
  - Add offline UI indicator in all HTML files
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (calculators mostly work offline already)

#### **PWA-003**: Push Notifications
- **Current State**: No notifications
- **Use Cases**:
  - Notify when new calculator released (Pets, Experts)
  - Alert when game data updated (new charm levels added)
  - Remind to backup profiles (monthly notification)
- **Implementation**:
  - Request notification permission on first visit
  - Set up Firebase Cloud Messaging or similar backend
  - Add notification settings page (opt-in/opt-out)
- **Effort**: High (2-3 weeks + backend setup)
- **Priority**: Low (not critical feature)

#### **PWA-004**: Install Prompt
- **Current State**: Browser's default install prompt
- **Enhancements**:
  - Custom install prompt with benefits explanation
  - Show after user interacts 3+ times (not immediately)
  - Track install conversions (how many installed)
- **Effort**: Low (3-5 days)
- **Priority**: Low

#### **MOBILE-001**: Touch Gestures
- **Current State**: Touch targets meet 44px minimum, but no gestures
- **Enhancements**:
  - Swipe left/right to navigate between calculators
  - Pinch-to-zoom on tables (mobile)
  - Pull-to-refresh for data updates
  - Long-press for context menu (e.g., quick delete profile)
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (nice-to-have)

#### **MOBILE-002**: Responsive Table Improvements
- **Current State**: Tables functional but can overflow on small screens
- **Enhancements**:
  - Card layout for tables on mobile (<480px)
  - Horizontal scroll indicators (show more columns available)
  - Sticky first column (item name always visible)
- **Effort**: Medium (1-2 weeks)
- **Priority**: Medium

---

## 📊 Analytics & Monitoring

#### **ANALYTICS-001**: Google Analytics Integration
- **Current State**: No analytics (no visibility into usage)
- **Requirements**:
  - Track page views (which calculators most popular)
  - Track button clicks (profile save, export, etc.)
  - Track errors (JavaScript exceptions)
  - Track calculator usage patterns (which levels upgraded most)
  - Privacy-compliant (GDPR, CCPA)
- **Implementation**:
  - Add Google Analytics 4 (GA4) script to all HTML
  - Create `src/Scripts/analytics.js` wrapper
  - Add event tracking: `Analytics.track('profile_saved', { calculator: 'charms' })`
- **Effort**: Low-Medium (1 week)
- **Priority**: Medium (data-driven improvements)

#### **ANALYTICS-002**: Error Monitoring (Sentry)
- **Current State**: Errors only visible in browser console (users don't report them)
- **Requirements**:
  - Automatic error reporting to Sentry or similar
  - Track JavaScript exceptions, network failures, React errors (if migrated)
  - Sourcemap support for minified code debugging
  - Group similar errors, prioritize by frequency
- **Implementation**:
  - Sign up for Sentry (free tier sufficient)
  - Add `<script>` tag to load Sentry SDK
  - Configure in `src/Scripts/error-handler.js`
- **Effort**: Low (2-3 days)
- **Priority**: High (proactive bug detection)

#### **ANALYTICS-003**: Performance Monitoring (Web Vitals)
- **Current State**: No performance tracking
- **Requirements**:
  - Track Core Web Vitals (LCP, FID, CLS)
  - Monitor page load times per calculator
  - Track CSV fetch times
  - Alert if performance degrades below thresholds
- **Implementation**:
  - Use `web-vitals` library (Google's official package)
  - Send metrics to Google Analytics or custom backend
- **Effort**: Low (3-5 days)
- **Priority**: Medium

#### **ANALYTICS-004**: Custom Dashboard
- **Current State**: No centralized view of metrics
- **Requirements**:
  - Build simple dashboard showing:
    - Daily active users
    - Most popular calculators
    - Error rate trend
    - Profile save/load success rate
  - Real-time updates (optional)
- **Implementation**:
  - Create `admin-dashboard.html` (protected page)
  - Fetch data from Google Analytics API or custom backend
  - Use Chart.js for visualizations
- **Effort**: High (3-4 weeks)
- **Priority**: Low (overkill for current scale)

---

## 🔒 Security & Validation

#### **SECURITY-001**: Input Validation & Sanitization
- **Current State**: Minimal validation (level ranges checked)
- **Requirements**:
  - Validate all user inputs before processing
  - Prevent XSS in profile names (sanitize HTML entities)
  - Limit profile name length (max 50 chars)
  - Prevent SQL injection if backend added (use prepared statements)
  - Rate limiting on localStorage writes (prevent abuse)
- **Files to Update**:
  - `src/Scripts/input-validators.js` - Expand validation rules
  - Use in all calculator modules and profiles.js
- **Effort**: Low-Medium (1 week)
- **Priority**: High

#### **SECURITY-002**: Content Security Policy (CSP)
- **Current State**: No CSP headers (allows inline scripts)
- **Requirements**:
  - Add CSP meta tag or HTTP header
  - Restrict script sources to `'self'` + CDNs
  - Disallow inline scripts (refactor if any exist)
  - Prevent clickjacking with `frame-ancestors 'none'`
- **Implementation**:
  - Add to `netlify.toml`: `Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com"`
  - Test thoroughly (CSP can break functionality if misconfigured)
- **Effort**: Low (2-3 days)
- **Priority**: Medium

#### **SECURITY-003**: Dependency Vulnerability Scanning
- **Current State**: Manual `npm audit` occasionally
- **Requirements**:
  - Automate with GitHub Dependabot (already available for free)
  - Weekly automated PRs to update vulnerable dependencies
  - Block PRs if critical vulnerabilities detected
- **Implementation**:
  - Enable Dependabot in GitHub repo settings
  - Configure `.github/dependabot.yml`
- **Effort**: Low (1 hour setup)
- **Priority**: High

#### **SECURITY-004**: Subresource Integrity (SRI)
- **Current State**: No SRI hashes for CDN resources
- **Requirements**:
  - Add `integrity="sha384-..."` to external scripts/styles
  - Prevent tampering if CDN compromised
- **Implementation**:
  - Generate SRI hashes: `openssl dgst -sha384 -binary file.js | openssl base64 -A`
  - Add to `<script>` and `<link>` tags
- **Effort**: Low (2-3 days)
- **Priority**: Low (no external dependencies currently)

---

## 🚀 Deployment & CI/CD

#### **CICD-001**: GitHub Actions Workflow
- **Current State**: Manual deployment to Netlify (git push triggers build)
- **Requirements**:
  - Automated testing on every PR (lint, unit tests, E2E tests)
  - Automated build/minification
  - Automated deployment to staging branch
  - Manual approval before production deploy
- **Files to Create**:
  - `.github/workflows/ci.yml` - Run tests on PR
  - `.github/workflows/deploy.yml` - Deploy to Netlify on merge to main
- **Effort**: Medium (1-2 weeks)
- **Priority**: Medium

#### **CICD-002**: Preview Deployments
- **Current State**: Only production site (no staging)
- **Requirements**:
  - Netlify Deploy Previews for PRs (already supported by Netlify)
  - Auto-comment PR with preview URL
  - Test changes before merging
- **Implementation**:
  - Enable in Netlify dashboard (already default)
  - Add GitHub Action to comment preview URL
- **Effort**: Low (1 day)
- **Priority**: Low (Netlify does this automatically)

#### **CICD-003**: Automated Versioning
- **Current State**: Manual version bumps in package.json
- **Requirements**:
  - Semantic versioning based on commit messages (conventional commits)
  - Auto-generate CHANGELOG.md from commits
  - Create GitHub releases with notes
- **Tools**: `semantic-release` or `standard-version`
- **Effort**: Medium (1 week setup)
- **Priority**: Low

#### **CICD-004**: Performance Budget Enforcement
- **Current State**: No checks for bundle size growth
- **Requirements**:
  - Fail CI if JavaScript bundle exceeds threshold (e.g., 500KB)
  - Fail if CSS exceeds 100KB
  - Alert if performance regresses (Lighthouse score drops)
- **Tools**: `bundlesize` package, Lighthouse CI
- **Effort**: Medium (1 week)
- **Priority**: Low

---

## 📚 Documentation Improvements

#### **DOCS-001**: Video Tutorials
- **Current State**: Text documentation only
- **Requirements**:
  - 5-minute quick start video (how to use charms calculator)
  - Developer onboarding video (architecture overview)
  - Screen recordings with voiceover
  - Host on YouTube, embed in README
- **Effort**: Medium (1 week recording + editing)
- **Priority**: Low (text docs sufficient for now)

#### **DOCS-002**: Interactive Playground
- **Current State**: Live site is the only way to test
- **Requirements**:
  - Embedded CodePen/JSFiddle examples for custom integrations
  - Showcase how to use `CalculationCore.compute()` API
  - Allow users to experiment without setting up project
- **Effort**: Low (3-5 days)
- **Priority**: Low (niche use case)

#### **DOCS-003**: API Reference Website
- **Current State**: API documented in markdown files
- **Requirements**:
  - Generate static site from JSDoc comments (once CODE-005 done)
  - Host on GitHub Pages or Netlify subdomain
  - Searchable, navigable, version-controlled
- **Tools**: `docsify`, `docusaurus`, or custom `jsdoc` template
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (docs already comprehensive)

#### **DOCS-004**: Contributing Guide
- **Current State**: No CONTRIBUTING.md
- **Requirements**:
  - How to report bugs (issue template)
  - How to suggest features (issue template)
  - How to submit PRs (code style, testing requirements)
  - How to add translations (step-by-step guide)
  - How to add new calculator page (reference existing template docs)
- **Files to Create**:
  - `.github/CONTRIBUTING.md`
  - `.github/ISSUE_TEMPLATE/bug_report.md`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
- **Effort**: Low (1 day)
- **Priority**: Medium (encourage community contributions)

#### **DOCS-005**: FAQ & Troubleshooting
- **Current State**: No centralized FAQ
- **Requirements**:
  - Common questions: "Why are my profiles not saving?" → localStorage disabled
  - "Why do costs differ from game?" → Data might be outdated, update Excel
  - "How to request a feature?" → Link to GitHub issues
  - Add to README.md or create separate FAQ.md
- **Effort**: Low (2-3 days)
- **Priority**: Low

---

## 🧪 Testing Infrastructure

#### **TEST-001**: Visual Regression Testing
- **Current State**: No automated visual testing (layout bugs caught manually)
- **Requirements**:
  - Screenshot all pages in both themes (light/dark)
  - Compare screenshots on every PR (detect unintended layout changes)
  - Highlight differences (pixel-diff)
- **Tools**: Percy, Chromatic, or BackstopJS
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (manual testing sufficient)

#### **TEST-002**: Accessibility Testing (Automated)
- **Current State**: Manual accessibility checks
- **Requirements**:
  - Run `axe-core` or `pa11y` on all pages
  - Fail CI if accessibility violations detected
  - Test keyboard navigation, ARIA labels, color contrast
- **Implementation**:
  - Add to GitHub Actions workflow
  - Generate accessibility report on every commit
- **Effort**: Low-Medium (1 week)
- **Priority**: Medium

#### **TEST-003**: Cross-Browser Testing
- **Current State**: Manual testing in Chrome/Firefox
- **Requirements**:
  - Automated tests in Chrome, Firefox, Safari, Edge
  - Test on real mobile devices (iOS Safari, Android Chrome)
  - Use BrowserStack or Sauce Labs (cloud testing)
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (modern browsers very compatible)

#### **TEST-004**: Load Testing
- **Current State**: No stress testing
- **Requirements**:
  - Simulate 1000+ concurrent users
  - Test service worker caching under load
  - Ensure localStorage doesn't hit quota with large profiles
- **Tools**: Apache JMeter, k6, or Artillery
- **Effort**: Low-Medium (1 week)
- **Priority**: Low (static site, no backend to overload)

---

## ♿ Accessibility Compliance

#### **A11Y-001**: WCAG 2.1 AA Compliance Audit
- **Current State**: Good foundation (semantic HTML, ARIA labels), but not formally audited
- **Requirements**:
  - Full WCAG 2.1 Level AA compliance
  - Test with screen readers (NVDA, JAWS, VoiceOver)
  - Color contrast ratio ≥4.5:1 for all text
  - All interactive elements keyboard accessible
  - Focus indicators visible and high contrast
- **Effort**: Medium (2-3 weeks)
- **Priority**: High (legal requirement in many regions)

#### **A11Y-002**: High Contrast Mode
- **Current State**: Dark/light themes exist but not high contrast
- **Requirements**:
  - Add third theme option: "High Contrast"
  - Black text on white, no subtle grays
  - Bold focus indicators
  - Respect Windows High Contrast Mode (media query)
- **Effort**: Low (1 week)
- **Priority**: Medium

#### **A11Y-003**: Screen Reader Announcements
- **Current State**: Dynamic content changes not announced
- **Requirements**:
  - Announce when calculations complete ("Results updated")
  - Announce profile save success ("Profile saved as 'My Plan'")
  - Use `aria-live` regions for dynamic updates
- **Effort**: Low (3-5 days)
- **Priority**: Medium

#### **A11Y-004**: Skip Links
- **Current State**: No skip navigation link
- **Requirements**:
  - Add "Skip to main content" link (visible on focus)
  - Skip to results table
  - Skip repetitive navigation
- **Effort**: Low (1-2 days)
- **Priority**: Medium

---

## 🔍 SEO & Discoverability

#### **SEO-001**: Meta Tags Enhancement
- **Current State**: Basic meta description on 2 pages (charms, chiefGear), missing on others
- **Requirements**:
  - Add meta description to ALL HTML pages (unique per page)
  - Add OpenGraph tags for social sharing (og:title, og:description, og:image)
  - Add Twitter Card tags (twitter:card, twitter:image)
  - Add canonical URLs
  - Add `robots.txt` (allow all)
- **Files to Update**: All HTML files in `src/`
- **Effort**: Low (2-3 days)
- **Priority**: Medium

#### **SEO-002**: Structured Data (Schema.org)
- **Current State**: No structured data
- **Requirements**:
  - Add JSON-LD for WebApplication schema
  - Specify software category, features, languages
  - Help Google show rich snippets in search results
- **Example**:
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Whiteout Survival Calculator",
    "description": "Resource calculator for Whiteout Survival game",
    "applicationCategory": "GameApplication",
    "offers": { "@type": "Offer", "price": "0" }
  }
  </script>
  ```
- **Effort**: Low (2-3 days)
- **Priority**: Low

#### **SEO-003**: Sitemap Generation
- **Current State**: No sitemap.xml
- **Requirements**:
  - Generate sitemap listing all pages
  - Submit to Google Search Console, Bing Webmaster Tools
  - Auto-update when new pages added
- **Implementation**:
  - Create `scripts/generate-sitemap.js` (run on build)
  - Output `src/sitemap.xml`
- **Effort**: Low (1 day)
- **Priority**: Medium

#### **SEO-004**: Blog/Changelog Page
- **Current State**: CHANGELOG.md exists but not web-accessible
- **Requirements**:
  - Convert CHANGELOG.md to HTML page
  - Add to navigation ("What's New")
  - Helps with SEO (fresh content, indexable)
- **Effort**: Low (2-3 days)
- **Priority**: Low

---

## 💾 Data Pipeline Enhancements

#### **DATA-001**: Automated Excel Data Updates
- **Current State**: Manual updates to `resource_data.xlsx` + manual script run
- **Requirements**:
  - Scrape game data from official wiki/API (if available)
  - Auto-update Excel file when new game version released
  - Notify developers of changes (Discord webhook, email)
- **Challenges**: No official API, would need web scraping (fragile)
- **Effort**: High (3-4 weeks + ongoing maintenance)
- **Priority**: Low (game data stable, manual updates sufficient)

#### **DATA-002**: Data Versioning
- **Current State**: CSV files overwritten on each extract (no history)
- **Requirements**:
  - Version CSV files: `charms_costs_v1.csv`, `charms_costs_v2.csv`
  - Store in `src/assets/versions/` folder
  - Allow users to load older data (if game rollback happens)
  - Track changes between versions (diff report)
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low (edge case scenario)

#### **DATA-003**: Data Validation Tool
- **Current State**: No validation, errors caught at runtime
- **Requirements**:
  - Validate CSV files after extraction:
    - Check for missing columns
    - Verify level ranges (0-15 for charms, etc.)
    - Ensure no negative costs
    - Warn if outliers detected (e.g., level 10 costs less than level 9)
  - Run automatically in CI (fail build if invalid data)
- **Files to Create**:
  - `scripts/validate-data.js`
- **Effort**: Medium (1-2 weeks)
- **Priority**: Medium

#### **DATA-004**: Bulk Import/Export for Profiles
- **Current State**: Profiles managed one-by-one in UI
- **Requirements**:
  - Export all profiles to single JSON file
  - Import JSON file to restore all profiles
  - Useful for testing, backups, migrations
- **Related to**: CALC-001 (profile export/import)
- **Effort**: Low (1 week, extends CALC-001)
- **Priority**: Low

---

## 🎁 Nice-to-Have Features

#### **NICE-001**: Custom Resource Prices
- **Requirements**:
  - Let users input market prices for resources (if trading enabled in game)
  - Calculate total gold/currency cost of upgrade plan
  - Save prices in profile
- **Use Case**: "I need 5000 Guides. Market price is 10 gold each. Total: 50,000 gold."
- **Effort**: Low-Medium (1 week)
- **Priority**: Low

#### **NICE-002**: Upgrade Path Optimizer
- **Requirements**:
  - Given current resources, suggest optimal upgrade order
  - Maximize power gain per resource spent
  - Consider diminishing returns
- **Algorithm**: Greedy optimization or linear programming
- **Effort**: High (2-3 weeks for good algorithm)
- **Priority**: Low (complex, niche use case)

#### **NICE-003**: Comparison Mode
- **Requirements**:
  - Compare two profiles side-by-side
  - Show difference in resources needed
  - Useful for "Plan A vs Plan B" decisions
- **Effort**: Medium (1-2 weeks)
- **Priority**: Low

#### **NICE-004**: Community Profiles Sharing
- **Requirements**:
  - Upload profile to central server (optional backend)
  - Browse community profiles by rating
  - Download and adapt others' upgrade plans
- **Challenges**: Requires backend (hosting costs, moderation)
- **Effort**: Very High (4-6 weeks + backend infrastructure)
- **Priority**: Very Low (major feature, questionable ROI)

#### **NICE-005**: Discord Bot Integration
- **Requirements**:
  - Discord bot that calculates costs via commands
  - Example: `!charms 5 10` → Returns cost to upgrade from level 5 to 10
  - Fetch data from live calculator API (would need backend)
- **Effort**: Medium (2-3 weeks)
- **Priority**: Low (fun project, limited reach)

#### **NICE-006**: Dark Mode Auto-Switch (Time-Based)
- **Current State**: Manual theme toggle or system preference
- **Requirements**:
  - Auto-switch to dark mode at sunset (based on geolocation)
  - Schedule override (user sets preferred times)
- **Effort**: Low (3-5 days)
- **Priority**: Very Low (gimmick)

#### **NICE-007**: Gamification (Achievements)
- **Requirements**:
  - Award badges for milestones:
    - "First Profile Saved"
    - "Maxed Out Charms" (all level 15)
    - "Power User" (10+ profiles)
  - Display badges in profile section
- **Effort**: Medium (1-2 weeks)
- **Priority**: Very Low (fun but not useful)

---

## 📊 Summary & Prioritization Matrix

| Priority | Category | Key Tasks | Estimated Total Effort |
|----------|----------|-----------|------------------------|
| **🔴 Critical** | Features | PETS-001, EXPERTS-001, CALC-001 | 6-9 weeks |
| **🔴 Critical** | Security | SECURITY-001, SECURITY-003, CODE-007 | 2-3 weeks |
| **🟠 High** | Performance | PERF-001, PERF-002 | 3-4 weeks |
| **🟠 High** | UX | UX-001, UX-003 | 2-3 weeks |
| **🟠 High** | Accessibility | A11Y-001 | 2-3 weeks |
| **🟡 Medium** | Code Quality | CODE-002, CODE-004, CODE-005 | 5-7 weeks |
| **🟡 Medium** | Translation | I18N-001 (Phase 2) | 2-3 weeks |
| **🟡 Medium** | SEO | SEO-001, SEO-003 | 1 week |
| **🟢 Low** | Advanced Features | All remaining I18N, NICE-* items | 10+ weeks |

---

## 🗓️ Suggested Roadmap

### Q1 2025 (Jan-Mar)
- ✅ PETS-002, EXPERTS-002 (data sheets creation)
- ✅ SECURITY-001, SECURITY-003 (input validation, dependency audit)
- ✅ UX-001 (loading states)
- ✅ SEO-001 (meta tags)
- ✅ CODE-004 (ESLint setup)

### Q2 2025 (Apr-Jun)
- ✅ PETS-001 (Pets calculator implementation)
- ✅ EXPERTS-001 (Experts calculator implementation)
- ✅ CALC-001 (profile export/import)
- ✅ PERF-001 (code splitting)

### Q3 2025 (Jul-Sep)
- ✅ PERF-002 (minification & bundling)
- ✅ CODE-002 (unit testing)
- ✅ UX-003 (enhanced error handling)
- ✅ A11Y-001 (WCAG audit)

### Q4 2025 (Oct-Dec)
- ✅ I18N-001 (Phase 2 - Namespaces)
- ✅ ANALYTICS-001, ANALYTICS-002 (analytics & error monitoring)
- ✅ CODE-005 (JSDoc documentation)
- ✅ CICD-001 (GitHub Actions)

### 2026+
- I18N-002, I18N-003, I18N-004 (Translation Phases 3-5)
- CODE-001 (TypeScript migration - long-term)
- NICE-* items (as time permits)

---

## 🤝 Contributing

Have ideas for improvements? Found a bug? Want to tackle an item from this TODO list?

1. Check existing [GitHub Issues](https://github.com/Orizzi/WOS-Forge/issues)
2. Open a new issue with `[TODO-ID]` prefix (e.g., `[PERF-001] Implement code splitting`)
3. Discuss approach before starting major work
4. Submit PR referencing the TODO item

---

## 📄 License & Acknowledgments

This TODO list is part of the [WOS Calculator project](https://github.com/Orizzi/WOS-Forge).  
Generated with analysis of project structure, documentation, and best practices.

**Last Updated**: 2025-01-XX  
**Maintainer**: Project Contributors  
**Version**: 1.0.0

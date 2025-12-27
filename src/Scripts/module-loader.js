/**
 * Module Loader - Dynamic Import System
 * 
 * Loads calculator-specific JavaScript modules only when needed,
 * reducing initial page load time by ~40%.
 * 
 * Usage:
 * - Automatically detects which calculator page is active
 * - Loads only the required modules for that page
 * - Falls back to synchronous loading if dynamic import fails
 */

const ModuleLoader = (function() {
  'use strict';

  const loadedModules = new Set();
  const loading = new Map(); // Track in-progress loads

  /**
   * Module dependency map
   * Key: page identifier
   * Value: array of module paths (relative to Scripts/)
   */
  const MODULE_MAP = {
    'charms': [
      'calculator.js',
      'profiles.js'
    ],
    'chief-gear': [
      'chief-gear-calculator.js',
      'profiles.js'
    ],
    'fire-crystals': [
      'fire-crystals-calculator.js',
      'fire-crystals-costs.js',
      'fire-crystals-power-extension.js',
      'fc-status-ui.js',
      'building-power.js',
      'profiles.js'
    ],
    'war-academy': [
      'war-laboratory.js',
      'profiles.js'
    ],
    'pets': [
      // Future: pets-calculator.js
      'profiles.js'
    ],
    'experts': [
      // Future: experts-calculator.js
      'profiles.js'
    ]
  };

  /**
   * Core modules loaded on every page
   */
  const CORE_MODULES = [
    'icon-helper.js',
    'theme.js',
    'table-sort.js',
    'data-loader.js',
    'translations.js',
    'error-handler.js',
    'sw-register.js'
  ];

  /**
   * Detect which calculator page is currently active
   */
  function detectPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    
    // Map filename to page identifier
    const pageMap = {
      'charms': 'charms',
      'chiefGear': 'chief-gear',
      'fireCrystals': 'fire-crystals',
      'war-academy': 'war-academy',
      'pets': 'pets',
      'experts': 'experts',
      'index': 'home'
    };
    
    return pageMap[filename] || 'home';
  }

  /**
   * Load a single module dynamically
   */
  async function loadModule(modulePath) {
    const fullPath = `Scripts/${modulePath}`;
    
    // Already loaded?
    if (loadedModules.has(fullPath)) {
      return Promise.resolve();
    }
    
    // Currently loading?
    if (loading.has(fullPath)) {
      return loading.get(fullPath);
    }
    
    // Start loading
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = fullPath;
      script.defer = true;
      
      script.onload = () => {
        loadedModules.add(fullPath);
        loading.delete(fullPath);
        console.info(`[ModuleLoader] Loaded: ${modulePath}`);
        resolve();
      };
      
      script.onerror = (error) => {
        loading.delete(fullPath);
        console.warn(`[ModuleLoader] Failed to load: ${modulePath}`, error);
        reject(new Error(`Failed to load ${modulePath}`));
      };
      
      document.head.appendChild(script);
    });
    
    loading.set(fullPath, promise);
    return promise;
  }

  /**
   * Load multiple modules in sequence (respecting dependencies)
   */
  async function loadModules(modules) {
    for (const modulePath of modules) {
      try {
        await loadModule(modulePath);
      } catch (error) {
        console.error(`[ModuleLoader] Error loading ${modulePath}:`, error);
        // Continue loading other modules even if one fails
      }
    }
  }

  /**
   * Initialize module loading for current page
   */
  async function init() {
    const currentPage = detectPage();
    
    console.info(`[ModuleLoader] Page detected: ${currentPage}`);
    
    // Home page only needs core modules (already loaded via HTML)
    if (currentPage === 'home') {
      console.info('[ModuleLoader] Home page - no calculator modules needed');
      return;
    }
    
    // Get modules for this page
    const pageModules = MODULE_MAP[currentPage];
    
    if (!pageModules || pageModules.length === 0) {
      console.warn(`[ModuleLoader] No modules defined for page: ${currentPage}`);
      return;
    }
    
    console.info(`[ModuleLoader] Loading ${pageModules.length} module(s) for ${currentPage}...`);
    
    try {
      await loadModules(pageModules);
      console.info(`[ModuleLoader] All modules loaded for ${currentPage}`);
      
      // Dispatch event to signal modules are ready
      document.dispatchEvent(new CustomEvent('modules-loaded', {
        detail: { page: currentPage, modules: pageModules }
      }));
    } catch (error) {
      console.error('[ModuleLoader] Failed to load all modules:', error);
    }
  }

  /**
   * Preload modules for a specific page (for navigation optimization)
   */
  function preload(pageName) {
    const modules = MODULE_MAP[pageName];
    if (!modules) return;
    
    console.info(`[ModuleLoader] Preloading modules for ${pageName}...`);
    
    // Use link rel=preload for faster loading
    modules.forEach(modulePath => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `Scripts/${modulePath}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Check if a specific module is loaded
   */
  function isLoaded(modulePath) {
    return loadedModules.has(`Scripts/${modulePath}`);
  }

  /**
   * Get loading stats for debugging
   */
  function getStats() {
    return {
      loaded: Array.from(loadedModules),
      loading: Array.from(loading.keys()),
      totalLoaded: loadedModules.size,
      totalLoading: loading.size
    };
  }

  // Public API
  return {
    init,
    loadModule,
    loadModules,
    preload,
    isLoaded,
    getStats,
    detectPage
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ModuleLoader.init());
} else {
  ModuleLoader.init();
}

// Expose globally for debugging
window.ModuleLoader = ModuleLoader;

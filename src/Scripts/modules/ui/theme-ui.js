(function () {
  'use strict';

  /**
   * Theme UI draft controller.
   * Exposes helpers to apply and persist theme without auto-binding listeners.
   */
  const STORAGE_KEY = 'wos-theme';

  function applyTheme(theme) {
    if (!document || !document.documentElement) return;
    document.documentElement.setAttribute('data-theme', theme);
  }

  function setTheme(theme, storageKey = STORAGE_KEY) {
    applyTheme(theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch (_) {}
  }

  function getTheme(storageKey = STORAGE_KEY, fallback = 'light') {
    try {
      return localStorage.getItem(storageKey) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  window.WOS = window.WOS || {};
  window.WOS.ui = window.WOS.ui || {};
  window.WOS.ui.theme = {
    applyTheme,
    setTheme,
    getTheme,
    STORAGE_KEY
  };
})();
(function () {
  'use strict';

  /**
   * I18n UI draft controller.
   * No automatic DOM binding; exposes functions to apply translations and manage language state.
   */
  function applyTranslations(root, translator) {
    if (!root || !translator) return 0;
    const nodes = root.querySelectorAll('[data-i18n]');
    let count = 0;
    nodes.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const text = translator(key);
      if (text !== undefined && text !== null) {
        el.textContent = text;
        count++;
      }
    });
    return count;
  }

  /**
   * Persist language selection.
   */
  function setLanguage(lang, storageKey = 'wos-language') {
    try {
      localStorage.setItem(storageKey, lang);
    } catch (_) {}
  }

  function getLanguage(storageKey = 'wos-language', fallback = 'en') {
    try {
      return localStorage.getItem(storageKey) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  window.WOS = window.WOS || {};
  window.WOS.ui = window.WOS.ui || {};
  window.WOS.ui.i18n = {
    applyTranslations,
    setLanguage,
    getLanguage
  };
})();
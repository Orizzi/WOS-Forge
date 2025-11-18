(function () {
  'use strict';

  /**
   * Fire Crystals UI draft controller.
   * Provides helpers to compute cost ranges and format them for rendering.
   */
  function computeTotals(costIndex, buildingName, fromLevel, toLevel, levelsArray) {
    if (!window.WOSCalcs || !window.WOSCalcs.fireCrystals) return null;
    return window.WOSCalcs.fireCrystals.sumRange(costIndex, buildingName, fromLevel, toLevel, levelsArray);
  }

  /**
   * Formats totals using provided formatters and icons.
   * @param {object|null} totals - result of fireCrystals.sumRange
   * @param {object} [opts]
   * @param {function} [opts.t]
   * @param {function} [opts.formatNumber]
   * @param {object} [opts.icons]
   */
  function renderTotals(totals, opts = {}) {
    if (!totals) return null;
    const t = opts.t || ((k) => k);
    const fmt = opts.formatNumber || ((n) => n);
    const icons = opts.icons;
    const labels = {
      normalFC: icons ? icons.totalLabel('fire-crystals', t('total')) : `${t('total')} ${t('fire-crystals') || 'Fire Crystals'}`,
      refineFC: icons ? icons.totalLabel('refine-crystals', t('total')) : `${t('total')} ${t('refine-crystals') || 'Refine Crystals'}`
    };
    return {
      labels,
      values: {
        normalFC: fmt(totals.normalFC || 0),
        refineFC: fmt(totals.refineFC || 0)
      }
    };
  }

  window.WOS = window.WOS || {};
  window.WOS.ui = window.WOS.ui || {};
  window.WOS.ui.fireCrystals = {
    /**
     * Initialize page bindings. Delegates to legacy init if provided.
     * @param {object} opts
     * @param {function} [opts.legacyInit]
     */
    initPage(opts = {}) {
      if (typeof opts.legacyInit === 'function') {
        return opts.legacyInit();
      }
      if (window.FireCrystalsCalculator && typeof window.FireCrystalsCalculator.legacyInit === 'function') {
        return window.FireCrystalsCalculator.legacyInit();
      }
      if (window.FireCrystalsCalculator && typeof window.FireCrystalsCalculator.init === 'function') {
        return window.FireCrystalsCalculator.init();
      }
      return null;
    },
    computeTotals,
    renderTotals
  };
})();

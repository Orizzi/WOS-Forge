(function () {
  'use strict';

  /**
   * Chief Gear UI draft controller.
   * Provides helpers to compute totals and prepare render data.
   */
  function computeTotals(costsTable, fromLevel, toLevel) {
    if (!window.WOSCalcs || !window.WOSCalcs.chiefGear) return null;
    return window.WOSCalcs.chiefGear.sumCosts(costsTable, fromLevel, toLevel);
  }

  /**
   * Formats totals into render-friendly values using shared formatters/icons.
   * @param {object|null} totals - result of chiefGear.sumCosts
   * @param {object} [opts]
   * @param {function} [opts.t] - translator
   * @param {function} [opts.formatNumber] - number formatter
   * @param {object} [opts.icons] - icons helper
   */
  function renderTotals(totals, opts = {}) {
    if (!totals) return null;
    const t = opts.t || ((k) => k);
    const fmt = opts.formatNumber || ((n) => n);
    const icons = opts.icons;

    const labels = {
      hardenedAlloy: icons ? icons.totalLabel('hardened-alloy', t('total')) : `${t('total')} ${t('hardened-alloy') || 'Hardened Alloy'}`,
      polishingSolution: icons ? icons.totalLabel('polishing-solution', t('total')) : `${t('total')} ${t('polishing-solution') || 'Polishing Solution'}`,
      designPlans: icons ? icons.totalLabel('design-plans', t('total')) : `${t('total')} ${t('design-plans') || 'Design Plans'}`,
      lunarAmber: icons ? icons.totalLabel('lunar-amber', t('total')) : `${t('total')} ${t('lunar-amber') || 'Lunar Amber'}`,
      power: t('power') || 'Power',
      svsPoints: t('svsPoints') || 'SvS Points'
    };

    return {
      labels,
      values: {
        hardenedAlloy: fmt(totals.hardenedAlloy || 0),
        polishingSolution: fmt(totals.polishingSolution || 0),
        designPlans: fmt(totals.designPlans || 0),
        lunarAmber: fmt(totals.lunarAmber || 0),
        power: fmt(totals.power || 0),
        svsPoints: fmt(totals.svsPoints || 0)
      }
    };
  }

  window.WOS = window.WOS || {};
  window.WOS.ui = window.WOS.ui || {};
  window.WOS.ui.chiefGear = {
    computeTotals,
    renderTotals
  };
})();
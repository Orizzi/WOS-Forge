(function () {
  'use strict';

  /**
   * Charms UI draft controller.
   * Pure helper functions to wire DOM to charms calculator results.
   * No side effects are executed until explicitly invoked by a page.
   */
  function computeTotals(costsTable, ranges) {
    if (!window.WOSCalcs || !window.WOSCalcs.charms) return null;
    return window.WOSCalcs.charms.sumAll(costsTable, ranges);
  }

  /**
   * Formats totals into a render-ready object using shared formatters/icons.
   * @param {object} totals - result of charms.sumAll
   * @param {object} [opts]
   * @param {function} [opts.t] - optional translator fn
   * @param {function} [opts.formatNumber] - number formatter
   * @param {object} [opts.icons] - icons helper with label/totalLabel
   */
  function renderTotals(totals, opts = {}) {
    const t = opts.t || ((k) => k);
    const fmt = opts.formatNumber || ((n) => n);
    const icons = opts.icons;
    const data = totals || { guides:0, designs:0, secrets:0, power:0, svsPoints:0 };

    const labels = {
      guides: icons ? icons.totalLabel('guides', t('total')) : `${t('total')} ${t('guides') || 'Guides'}`,
      designs: icons ? icons.totalLabel('designs', t('total')) : `${t('total')} ${t('designs') || 'Designs'}`,
      secrets: icons ? icons.totalLabel('secrets', t('total')) : `${t('total')} ${t('secrets') || 'Secrets'}`,
      power: t('power') || 'Power',
      svsPoints: t('svsPoints') || 'SvS Points'
    };

    return {
      labels,
      values: {
        guides: fmt(data.guides),
        designs: fmt(data.designs),
        secrets: fmt(data.secrets),
        power: fmt(data.power),
        svsPoints: fmt(data.svsPoints)
      }
    };
  }

  window.WOS = window.WOS || {};
  window.WOS.ui = window.WOS.ui || {};
  window.WOS.ui.charms = {
    computeTotals,
    renderTotals
  };
})();
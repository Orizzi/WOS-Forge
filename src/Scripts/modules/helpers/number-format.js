(function () {
  'use strict';

  /**
   * formatNumber
   * Formats a number with locale-aware separators.
   * @param {number} value - number to format
   * @param {Object} [options] - Intl.NumberFormat options
   * @param {string} [locale] - optional locale override
   */
  function formatNumber(value, options = {}, locale = undefined) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '0';
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (_) {
      return value.toString();
    }
  }

  /**
   * formatCompact
   * Formats a number using compact notation (e.g., 1.2K, 3.4M) when available.
   */
  function formatCompact(value, locale = undefined) {
    return formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 }, locale);
  }

  window.WOSHelpers = window.WOSHelpers || {};
  window.WOSHelpers.number = {
    formatNumber,
    formatCompact
  };
})();
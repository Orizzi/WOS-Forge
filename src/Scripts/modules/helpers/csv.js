(function () {
  'use strict';

  /**
   * parseCsv
   * Parses CSV text into { header, rows } where header is string[] and rows is string[][].
   * Trims cells and skips empty lines. Does not handle quoted commas (simple datasets).
   */
  function parseCsv(text) {
    if (typeof text !== 'string' || text.trim().length === 0) {
      return { header: [], rows: [] };
    }
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) return { header: [], rows: [] };

    const header = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => line.split(',').map((part) => part.trim()));
    return { header, rows };
  }

  /**
   * parseCsvToObjects
   * Converts CSV text into an array of objects keyed by header names.
   * Cells remain strings; conversion is left to the caller.
   */
  function parseCsvToObjects(text) {
    const { header, rows } = parseCsv(text);
    if (header.length === 0) return [];
    return rows.map((row) => {
      const obj = {};
      header.forEach((key, idx) => {
        obj[key] = row[idx] !== undefined ? row[idx] : '';
      });
      return obj;
    });
  }

  window.WOSHelpers = window.WOSHelpers || {};
  window.WOSHelpers.csv = {
    parseCsv,
    parseCsvToObjects
  };
})();
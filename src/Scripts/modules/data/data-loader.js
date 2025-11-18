(function () {
  'use strict';

  const cache = {};

  async function fetchText(url, options = {}) {
    if (!url) return '';
    if (cache[url]) return cache[url];

    cache[url] = fetch(url, { cache: 'no-cache', ...options })
      .then((res) => (res.ok ? res.text() : ''))
      .catch(() => '');

    return cache[url];
  }

  async function loadCsv(url) {
    const text = await fetchText(url);
    if (!text) return { header: [], rows: [] };
    if (!window.WOSHelpers || !window.WOSHelpers.csv) return { header: [], rows: [] };
    return window.WOSHelpers.csv.parseCsv(text);
  }

  async function fetchJson(url, options = {}) {
    if (!url) return null;
    if (cache[url]) return cache[url];

    cache[url] = fetch(url, { cache: 'no-cache', ...options })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    return cache[url];
  }

  // Basic status helper for future use (e.g., dispatching data-ready events).
  function makeStatus(resource) {
    return { resource, loaded: false, rows: 0, source: 'loading', error: false };
  }

  function dispatchReady(resource, detail) {
    try {
      window.dispatchEvent(new CustomEvent(`${resource}-ready`, { detail }));
    } catch (_) {
      /* noop */
    }
  }

  window.WOSData = window.WOSData || {};
  window.WOSData.loader = {
    fetchText,
    loadCsv,
    fetchJson,
    makeStatus,
    dispatchReady,
    cache
  };
})();
const InputValidation = (function(){
  'use strict';

  const DEFAULT_MIN = Number.NEGATIVE_INFINITY;
  const DEFAULT_MAX = Number.POSITIVE_INFINITY;

  function clampNumber(value, { min = DEFAULT_MIN, max = DEFAULT_MAX, fallback = 0 } = {}) {
    const n = Number.parseInt(value, 10);
    const base = Number.isFinite(n) ? n : fallback;
    const clamped = Math.min(Math.max(base, min), max);
    return Number.isFinite(clamped) ? clamped : fallback;
  }

  function toInt(value, { min = DEFAULT_MIN, max = DEFAULT_MAX, fallback = 0 } = {}) {
    return clampNumber(value, { min, max, fallback });
  }

  function numberOrZero(value, { min = 0, max = 999999999, fallback = 0 } = {}) {
    return toInt(value, { min, max, fallback });
  }

  function sanitizeRange(from, to, { min = 0, max = DEFAULT_MAX, fallbackStart = min } = {}) {
    const start = toInt(from, { min, max, fallback: fallbackStart });
    const end = toInt(to, { min: start, max, fallback: start });
    return { start, end };
  }

  return {
    clampNumber,
    toInt,
    numberOrZero,
    sanitizeRange
  };
})();

if (typeof window !== 'undefined') {
  window.InputValidation = InputValidation;
}

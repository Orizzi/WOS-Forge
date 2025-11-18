(function () {
  'use strict';

  // Central icon map for all calculators/pages.
  const ICON_MAP = {
    // Fire Crystals resources
    'fire-crystals': 'assets/resources/base/fire-crystals.png',
    'refine-crystals': 'assets/resources/base/refine-crystals.png',
    meat: 'assets/resources/base/meat.png',
    wood: 'assets/resources/base/wood.png',
    coal: 'assets/resources/base/coal.png',
    iron: 'assets/resources/base/iron.png',

    // Chief Gear resources
    'hardened-alloy': 'assets/resources/chief-gear/hardened-alloy.png',
    'polishing-solution': 'assets/resources/chief-gear/polishing-solution.png',
    'design-plans': 'assets/resources/chief-gear/design-plans.png',
    'lunar-amber': 'assets/resources/chief-gear/lunar-amber.png',

    // Charms resources
    guides: 'assets/resources/charms/guides.png',
    designs: 'assets/resources/charms/designs.png',
    secrets: 'assets/resources/charms/secrets.png'
  };

  // Returns HTML for an icon + text label. Falls back to text when missing.
  function label(key, formatText) {
    const url = ICON_MAP[key];
    const text =
      typeof formatText === 'function'
        ? formatText(key)
        : key.charAt(0).toUpperCase() + key.slice(1);
    if (!url) return text;
    return `<img class="res-icon" src="${url}" alt="${text}" onerror="this.style.display='none'"> ${text}`;
  }

  // Convenience for "Total X" labels with icons.
  function totalLabel(key, totalText = 'Total', formatText) {
    const text =
      typeof formatText === 'function'
        ? formatText(totalText, key)
        : `${totalText} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
    const url = ICON_MAP[key];
    if (!url) return text;
    return `<img class="res-icon" src="${url}" alt="${text}" onerror="this.style.display='none'"> ${text}`;
  }

  window.WOSHelpers = window.WOSHelpers || {};
  window.WOSHelpers.icons = {
    ICON_MAP,
    label,
    totalLabel
  };
})();
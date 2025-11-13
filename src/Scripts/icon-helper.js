(function(){
  'use strict';
  const ICON_MAP = {
    'fire-crystals':'assets/resources/fire-crystals.png',
    'refine-crystals':'assets/resources/refine-crystals.png',
    meat:'assets/resources/meat.png',
    wood:'assets/resources/wood.png',
    coal:'assets/resources/coal.png',
    iron:'assets/resources/iron.png',
    'hardened-alloy':'assets/resources/hardened-alloy.svg',
    'polishing-solution':'assets/resources/polishing-solution.svg',
    'design-plans':'assets/resources/design-plans.svg',
    'lunar-amber':'assets/resources/lunar-amber.svg',
    guides:'assets/resources/charm-guides.svg',
    designs:'assets/resources/charm-designs.svg',
    secrets:'assets/resources/charm-secrets.svg'
  };
  function label(key, t){
    const url = ICON_MAP[key];
    const text = t ? t(key) : key.charAt(0).toUpperCase()+key.slice(1);
    if(!url) return text;
    return `<img class="res-icon" src="${url}" alt="${text}" onerror="this.style.display='none'"> ${text}`;
  }
  window.IconHelper = { label };
})();
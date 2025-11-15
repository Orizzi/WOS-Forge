(function(){
  'use strict';
  const ICON_MAP = {
    // Fire Crystals resources
    'fire-crystals':'assets/resources/base/fire-crystals.png',
    'refine-crystals':'assets/resources/base/refine-crystals.png',
    meat:'assets/resources/base/meat.png',
    wood:'assets/resources/base/wood.png',
    coal:'assets/resources/base/coal.png',
    iron:'assets/resources/base/iron.png',
    
    // Chief Gear resources
    'hardened-alloy':'assets/resources/chief-gear/hardened-alloy.png',
    'polishing-solution':'assets/resources/chief-gear/polishing-solution.png',
    'design-plans':'assets/resources/chief-gear/design-plans.png',
    'lunar-amber':'assets/resources/chief-gear/lunar-amber.png',
    
    // Charms resources
    guides:'assets/resources/charms/guides.png',
    designs:'assets/resources/charms/designs.png',
    secrets:'assets/resources/charms/secrets.png'
  };
  function label(key, t){
    const url = ICON_MAP[key];
    const text = t ? t(key) : key.charAt(0).toUpperCase()+key.slice(1);
    if(!url) return text;
    return `<img class="res-icon" src="${url}" alt="${text}" onerror="this.style.display='none'"> ${text}`;
  }
  window.IconHelper = { label };
})();
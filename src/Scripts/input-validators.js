(function(){
  'use strict';

  // Map of input id -> max digits constraint
  const digitLimits = {
    'inventory-fire-crystals': 6,
    'inventory-refine-crystals': 4,
    'inventory-meat': 12,
    'inventory-wood': 12,
    'inventory-coal': 11,
    'inventory-iron': 11,
  };

  function sanitizeToDigits(value){
    // Remove non-digits; keep empty as '' so user can clear
    return (value || '').replace(/\D+/g, '');
  }

  function enforceMaxDigits(el, maxDigits){
    const raw = sanitizeToDigits(el.value);
    if(!raw){ el.value = ''; return; }
    // Trim leading zeros only if exceeding length to avoid fighting user on small values
    let v = raw;
    if (v.length > maxDigits) v = v.slice(0, maxDigits);
    el.value = v;
  }

  function attach(id, maxDigits){
    const el = document.getElementById(id);
    if(!el) return;
    // On input, sanitize and cap length
    el.addEventListener('input', function(){ enforceMaxDigits(el, maxDigits); });
    // On blur, also enforce once more (useful for pasted values)
    el.addEventListener('blur', function(){ enforceMaxDigits(el, maxDigits); });
  }

  function onReady(){
    Object.entries(digitLimits).forEach(([id, max]) => attach(id, max));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

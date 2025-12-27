(function(){
  'use strict';

  function validateLevel(value, min = 0, max = 16){
    if (value === null || value === undefined || value === '') return false;
    const n = parseInt(value, 10);
    if (!Number.isInteger(n)) return false;
    return n >= min && n <= max;
  }

  function validateInventory(value, min = 0, max = 999999999){
    if (value === null || value === undefined || value === '') return true;
    const n = parseInt(value, 10);
    if (!Number.isInteger(n)) return false;
    return n >= min && n <= max;
  }

  function validateProfileName(name, maxLength = 50){
    if (typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length > 0 && trimmed.length <= maxLength;
  }

  function sanitizeProfileName(name){
    return String(name || '').trim().slice(0, 50);
  }

  function validateProfileJson(data){
    if (typeof data !== 'object' || data === null) return false;
    const hasAtLeastOne = Object.values(data).some(profile =>
      profile && typeof profile === 'object' &&
      (profile.charms || profile.chiefGear || profile.fireCrystals || profile.warLab)
    );
    if (!hasAtLeastOne) return false;
    return Object.values(data).every(profile => profile === null || typeof profile === 'object');
  }

  function getErrorMessage(fieldType){
    const t = window.I18n?.t || (k => k);
    switch(fieldType){
      case 'level': return t('validation-error-level') || 'Level must be between 0 and 16';
      case 'inventory': return t('validation-error-inventory') || 'Must be a positive number';
      case 'profile-name': return t('validation-error-profile-name') || 'Profile name must be 1-50 characters';
      default: return t('validation-error-general') || 'Invalid input';
    }
  }

  window.InputValidators = {
    validateLevel,
    validateInventory,
    validateProfileName,
    sanitizeProfileName,
    validateProfileJson,
    getErrorMessage
  };
})();
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

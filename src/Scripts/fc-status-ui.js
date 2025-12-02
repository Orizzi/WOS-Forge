(function(){
  'use strict';

  function setStatus(el, state){
    if(!el) return;
    const fc = state || window.FCDataStatus || { loaded:false, rows:0, source:'fallback' };
    const t = window.I18n?.t || ((k) => k);

    if(fc.loaded && fc.rows > 0 && !fc.error){
      el.dataset.status = 'ok';
      const src = fc.source || 'data';
      el.textContent = `${t('data-ok') || 'Data OK'} (${fc.rows} rows, ${src})`;
    } else if (fc.error) {
      el.dataset.status = 'warn';
      el.textContent = t('data-failed') || 'Data failed to load';
    } else {
      el.dataset.status = 'warn';
      el.textContent = t('data-not-loaded') || 'Data not loaded';
    }
  }

  function onReady(){
    const el = document.getElementById('fc-status');
    if(!el) return;
    setStatus(el);

    // Update when FC data is ready
    window.addEventListener('fc-data-ready', function(){ setStatus(el); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

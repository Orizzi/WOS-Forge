(function(){
  'use strict';

  function setStatus(el, state){
    if(!el) return;
    const fc = window.FCDataStatus || { loaded:false, rows:0, source:'fallback' };

    if(fc.loaded && fc.rows > 0){
      el.dataset.status = 'ok';
      el.textContent = `Data OK (rows: ${fc.rows})`;
    } else {
      el.dataset.status = 'warn';
      el.textContent = `Data not loaded`;
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

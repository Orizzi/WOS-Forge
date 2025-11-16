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
      el.textContent = `Using fallback data`;
    }
  }

  function onReady(){
    const el = document.getElementById('csv-status');
    if(!el) return;
    setStatus(el);

    // Update when FC CSV is ready
    window.addEventListener('fc-csv-ready', function(){ setStatus(el); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

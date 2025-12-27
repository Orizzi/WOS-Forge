(function(){
  'use strict';
  const cache = {};

  async function fetchText(url){
    if(cache[url]) return cache[url];
    cache[url] = fetch(url,{cache:'no-cache'})
      .then(r=>{
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .catch(err=>{
        console.warn('[DataLoader] Fetch failed for', url, err);
        // Propagate as empty string to signal failure to loader
        return '';
      });
    return cache[url];
  }

  async function loadCsv(url){
    try{
      const text = await fetchText(url);
      if(!text || !text.trim()){
        throw new Error('Empty CSV response');
      }
      const lines = text.split(/\r?\n/).filter(l=> l.trim().length>0);
      if(lines.length===0){
        throw new Error('No CSV rows');
      }
      const header = lines[0].split(',').map(h=> h.trim());
      const rows = lines.slice(1).map(l=> l.split(',').map(p=> p.trim()));
      return { header, rows };
    }catch(e){
      console.warn('[DataLoader] CSV load failed for', url, ':', e.message || e);
      if(typeof document !== 'undefined'){
        try{
          document.dispatchEvent(new CustomEvent('csv-load-failed', { detail: { url, error: e.message || String(e) } }));
        }catch(_err){}
      }
      return { header:[], rows:[] };
    }
  }

  window.DataLoader = { fetchText, loadCsv };
})();
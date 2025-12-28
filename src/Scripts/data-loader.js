(function(){
  'use strict';
  const cache = {};
  const CSV_CACHE_KEY = 'wos-csv-cache';
  const CSV_VERSION_KEY = 'wos-csv-version';
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  function emit(name, detail){
    if(typeof document === 'undefined') return;
    try{ document.dispatchEvent(new CustomEvent(name, { detail })); }catch(_e){}
  }

  function getCacheVersion(){
    try{
      return localStorage.getItem(CSV_VERSION_KEY) || '1';
    }catch(_e){
      return '1';
    }
  }

  function setCacheVersion(version){
    try{
      localStorage.setItem(CSV_VERSION_KEY, String(version));
    }catch(_e){}
  }

  function readCachedCsv(url){
    try{
      const raw = localStorage.getItem(CSV_CACHE_KEY);
      if(!raw) return null;
      const allCache = JSON.parse(raw);
      const entry = allCache[url];
      if(!entry) return null;
      const now = Date.now();
      const age = now - (entry.timestamp || 0);
      if(age > CACHE_TTL_MS){
        console.info('[DataLoader] Cache expired for', url);
        return null;
      }
      if(entry.version !== getCacheVersion()){
        console.info('[DataLoader] Cache version mismatch for', url);
        return null;
      }
      emit('csv-cache-hit', { url, age: Math.floor(age / 1000) });
      return entry.data;
    }catch(_e){
      return null;
    }
  }

  function writeCachedCsv(url, data){
    try{
      const raw = localStorage.getItem(CSV_CACHE_KEY) || '{}';
      const allCache = JSON.parse(raw);
      allCache[url] = {
        data,
        timestamp: Date.now(),
        version: getCacheVersion()
      };
      localStorage.setItem(CSV_CACHE_KEY, JSON.stringify(allCache));
    }catch(_e){
      console.warn('[DataLoader] Failed to cache CSV:', _e.message || _e);
    }
  }

  function clearCsvCache(){
    try{
      localStorage.removeItem(CSV_CACHE_KEY);
      console.info('[DataLoader] CSV cache cleared');
    }catch(_e){}
  }

  async function fetchText(url){
    if(cache[url]) return cache[url];
    cache[url] = fetch(url,{cache:'no-cache'})
      .then(r=>{
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .catch(err=>{
        console.warn('[DataLoader] Fetch failed for', url, err);
        return '';
      });
    return cache[url];
  }

  async function loadCsv(url, options = {}){
    const { useCache = true, forceRefresh = false } = options;
    
    emit('csv-load-started', { url });

    // Check cache first unless forceRefresh
    if(useCache && !forceRefresh){
      const cached = readCachedCsv(url);
      if(cached){
        emit('csv-load-succeeded', { url, rows: cached.rows.length, headerCount: cached.header.length, fromCache: true });
        return cached;
      }
    }

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
      const result = { header, rows };
      
      // Write to cache
      if(useCache){
        writeCachedCsv(url, result);
      }
      
      emit('csv-load-succeeded', { url, rows: rows.length, headerCount: header.length, fromCache: false });
      return result;
    }catch(e){
      console.warn('[DataLoader] CSV load failed for', url, ':', e.message || e);
      emit('csv-load-failed', { url, error: e.message || String(e) });
      return { header:[], rows:[] };
    }
  }

  window.DataLoader = { 
    fetchText, 
    loadCsv,
    clearCsvCache,
    getCacheVersion,
    setCacheVersion
  };
})();
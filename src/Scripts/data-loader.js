(function(){
  'use strict';
  const cache = {};
  async function fetchText(url){
    if(cache[url]) return cache[url];
    cache[url] = fetch(url,{cache:'no-cache'}).then(r=> r.ok? r.text(): '')
      .catch(()=> '');
    return cache[url];
  }
  async function loadCsv(url){
    const text = await fetchText(url);
    if(!text) return { header:[], rows:[] };
    const lines = text.split(/\r?\n/).filter(l=> l.trim().length>0);
    if(lines.length===0) return { header:[], rows:[] };
    const header = lines[0].split(',').map(h=> h.trim());
    const rows = lines.slice(1).map(l=> l.split(',').map(p=> p.trim()));
    return { header, rows };
  }
  window.DataLoader = { fetchText, loadCsv };
})();
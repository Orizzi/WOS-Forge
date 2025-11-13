(function(){
  'use strict';
  const POWER_MAP = {}; // { BuildingName: { LevelKey: power } }
  function loadCsv(url){
    return fetch(url,{cache:'no-cache'}).then(r=> r.ok ? r.text(): '')
      .then(text => {
        if(!text) return;
        const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0);
        if(lines.length<2) return;
        const header = lines[0].split(',').map(h=>h.trim().toLowerCase());
        const bi = header.indexOf('building');
        const li = header.indexOf('level');
        const pi = header.indexOf('power');
        if([bi,li,pi].some(v=>v===-1)) return;
        let applied=0;
        for(let i=1;i<lines.length;i++){
          const parts = lines[i].split(',');
          const b = parts[bi]?.trim();
          const lvl = parts[li]?.trim();
          const p = parseInt(parts[pi],10);
          if(!b||!lvl||isNaN(p)) continue;
          if(!POWER_MAP[b]) POWER_MAP[b]={};
          POWER_MAP[b][lvl]=p; applied++;
        }
        if(applied>0) console.info(`[FireCrystals Power] Loaded ${applied} entries.`);
      }).catch(()=>{});
  }

  function computeTotalPower(){
    if(!window.FireCrystalsCalculator) return 0;
    const buildings = ['Furnace','Embassy','Command Center','Infirmary','Infantry Camp','Marksman Camp','Lancer Camp','War Academy'];
    let total=0;
    buildings.forEach(b=>{
      const id = b.toLowerCase().replace(/ /g,'-');
      const sel = document.getElementById(`${id}-desired`);
      const lvl = sel && sel.value;
      if(lvl && POWER_MAP[b] && POWER_MAP[b][lvl]!=null){
        total += POWER_MAP[b][lvl];
      }
    });
    return total;
  }

  function applyPowerToDom(){
    const total = computeTotalPower();
    const items = Array.from(document.querySelectorAll('.total-item'));
    const target = items.find(it => /Total Power:/i.test(it.textContent));
    if(target){
      const valueSpan = target.querySelector('.resource-value');
      if(valueSpan){
        valueSpan.innerHTML = `<strong>${total>0? total.toLocaleString():'Data pending'}</strong>`;
      }
    }
  }

  function wrapCalculate(){
    if(!window.FireCrystalsCalculator || !window.FireCrystalsCalculator.calculateAll) return;
    const original = window.FireCrystalsCalculator.calculateAll;
    window.FireCrystalsCalculator.calculateAll = function(){
      original();
      applyPowerToDom();
    };
  }

  function init(){
    loadCsv('assets/building_power.csv').then(()=>{
      wrapCalculate();
      // Initial attempt after DOM paints
      setTimeout(applyPowerToDom, 200);
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
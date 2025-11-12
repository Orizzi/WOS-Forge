/* Toggle light theme on body and persist choice in localStorage */
(function(){
  const TOGGLE_ID = 'dark-mode-toggle';
  const STORAGE_KEY = 'wos-theme';
  const CLASS = 'light-theme';

  const toggle = document.getElementById(TOGGLE_ID);

  function setTheme(isLight){
    document.body.classList.toggle(CLASS, !!isLight);
    try { localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark'); } catch(e){}
    // update the toggle button label to reflect the action it will perform
    if(toggle){
      // when currently in light mode, the button should offer to switch to dark mode
      toggle.textContent = isLight ? 'Dark mode toggle' : 'Light mode toggle';
      // keep an accessible pressed state (true when light mode is active)
      try { toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false'); } catch(e){}
    }
  }

  function init(){
    const saved = (()=>{ try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; } })() || 'dark';
    setTheme(saved === 'light');
    if(!toggle) return;
    toggle.addEventListener('click', function(){
      const isLight = !document.body.classList.contains(CLASS);
      setTheme(isLight);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * ====== THEME TOGGLE MODULE (Dark/Light Mode) ======
 * 
 * This module handles switching between dark and light themes.
 * The theme choice is saved in browser storage so it remembers your preference.
 * 
 * How it works:
 * 1. User clicks the theme toggle button
 * 2. setTheme() adds/removes the 'light-theme' class from the body
 * 3. CSS automatically changes colors based on whether 'light-theme' is present
 * 4. The choice is saved to localStorage (browser storage)
 * 5. Next time you visit, it loads your saved theme preference
 */

const ThemeModule = (function(){
  const TOGGLE_ID = 'dark-mode-toggle';      // ID of the toggle button
  const STORAGE_KEY = 'wos-theme';           // Key for storing theme choice
  const CLASS = 'light-theme';               // CSS class that triggers light theme

  const toggle = document.getElementById(TOGGLE_ID);

  /**
   * setTheme(isLight)
   * Applies a theme and saves the choice
   * @param {boolean} isLight - true for light theme, false for dark
   */
  function setTheme(isLight){
    // Add or remove 'light-theme' class on both <html> and <body>
    // Some selectors target html.light-theme while others use body.light-theme
    const on = !!isLight;
    try { document.documentElement.classList.toggle(CLASS, on); } catch(e){}
    try { document.body.classList.toggle(CLASS, on); } catch(e){}
    
    // Save the choice to browser storage (survives page refresh)
    try { 
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark'); 
    } catch(e){
      // If localStorage fails (e.g., in private browsing), silently continue
    }
    
    // Update button text with emoji to show current theme
    if(toggle){
      // If currently in light mode, show sun emoji (light mode active)
      // If currently in dark mode, show moon emoji (dark mode active)
      toggle.textContent = isLight ? '☀️ Light' : '🌙 Dark';
      
      // For accessibility: tell screen readers if this button is "pressed" (active)
      try { 
        toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false'); 
      } catch(e){}
    }
  }

  /**
   * init()
   * Loads saved theme and sets up the click handler
   * Called once when the page loads
   */
  function init(){
    // Get saved theme from browser storage, default to 'dark' if not found
    const saved = (()=>{ 
      try { 
        return localStorage.getItem(STORAGE_KEY); 
      } catch(e){ 
        return null; 
      } 
    })() || 'dark';
    
    // Apply the saved theme
    setTheme(saved === 'light');
    
    if(!toggle) return;
    
    // When user clicks the button, toggle the theme
    toggle.addEventListener('click', function(){
      const isLight = !document.body.classList.contains(CLASS);
      setTheme(isLight);
    });
  }

  // Public API
  return {
    init,
    setTheme
  };
})();

// Auto-initialize when page loads
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => ThemeModule.init());
} else {
  ThemeModule.init();
}

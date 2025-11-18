(function(){
  'use strict';
  const NAV_TOGGLE_CLASS = 'nav-open';

  function initNavToggle(){
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if(!toggle || !nav) return;

    const header = document.querySelector('.header-with-nav');

    const closeNav = () => {
      document.body.classList.remove(NAV_TOGGLE_CLASS);
      if(header) header.classList.remove(NAV_TOGGLE_CLASS);
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openNav = () => {
      document.body.classList.add(NAV_TOGGLE_CLASS);
      if(header) header.classList.add(NAV_TOGGLE_CLASS);
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      if(isOpen){
        closeNav();
      } else {
        openNav();
      }
    });

    // Auto-close on resize back to desktop
    window.addEventListener('resize', () => {
      if(window.innerWidth > 900){
        closeNav();
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initNavToggle);
  } else {
    initNavToggle();
  }
})();

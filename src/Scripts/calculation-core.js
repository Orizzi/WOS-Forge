(function () {
  'use strict';

  const adapters = {};

  function safe(fn) {
    try {
      return fn();
    } catch (err) {
      console.warn('[CalcCore] adapter failed', err);
      return undefined;
    }
  }

  function registerAdapter({ id, isActive, run }) {
    if (!id || typeof run !== 'function') return;
    adapters[id] = { isActive, run };
  }

  function run(id) {
    const adapter = adapters[id];
    if (!adapter) return false;
    safe(adapter.run);
    return true;
  }

  function runActive() {
    let ran = false;
    Object.entries(adapters).forEach(([, adapter]) => {
      const active = typeof adapter.isActive === 'function' ? safe(adapter.isActive) : true;
      if (active) {
        safe(adapter.run);
        ran = true;
      }
    });
    if (!ran) {
      // Fallback: attempt all adapters even if no isActive flag is provided.
      Object.values(adapters).forEach((adapter) => safe(adapter.run));
    }
    return ran;
  }

  function runAll() {
    Object.values(adapters).forEach((adapter) => safe(adapter.run));
  }

  function ensureDefaultAdapters() {
    registerAdapter({
      id: 'charms',
      isActive: () => !!document.querySelector('select[id*="-charm-"]'),
      run: () => {
        if (window.CalculatorModule && typeof window.CalculatorModule.calculateAll === 'function') {
          window.CalculatorModule.calculateAll();
        }
      }
    });

    registerAdapter({
      id: 'chiefGear',
      isActive: () => !!document.getElementById('helmet-start'),
      run: () => {
        if (window.ChiefGearCalculator && typeof window.ChiefGearCalculator.calculateAll === 'function') {
          window.ChiefGearCalculator.calculateAll();
        }
      }
    });

    registerAdapter({
      id: 'fireCrystals',
      isActive: () => !!document.getElementById('furnace-start'),
      run: () => {
        if (window.FireCrystalsCalculator && typeof window.FireCrystalsCalculator.calculateAll === 'function') {
          window.FireCrystalsCalculator.calculateAll();
        }
      }
    });

    registerAdapter({
      id: 'warLab',
      isActive: () => !!document.querySelector('.war-lab-page'),
      run: () => {
        if (window.WarLabCalculator && typeof window.WarLabCalculator.calculateAll === 'function') {
          window.WarLabCalculator.calculateAll();
        }
      }
    });
  }

  ensureDefaultAdapters();

  function scheduleRunActive() {
    if (scheduleRunActive._scheduled) return;
    scheduleRunActive._scheduled = true;
    requestAnimationFrame(() => {
      scheduleRunActive._scheduled = false;
      runActive();
    });
  }

  function bindInventoryAutoCalc() {
    const inputs = document.querySelectorAll('input[id^="inventory-"]');
    inputs.forEach((input) => {
      input.addEventListener('input', scheduleRunActive);
      input.addEventListener('change', scheduleRunActive);
    });
  }

  function bindGenericAutoCalc() {
    const ignoreIds = new Set(['profiles-list', 'language-selector', 'profile-name']);
    const nodes = document.querySelectorAll('input, select, textarea');
    nodes.forEach((el) => {
      if (ignoreIds.has(el.id)) return;
      if (el.type === 'button' || el.type === 'submit' || el.type === 'reset') return;
      el.addEventListener('input', scheduleRunActive);
      el.addEventListener('change', scheduleRunActive);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindInventoryAutoCalc();
      bindGenericAutoCalc();
    }, { once: true });
  } else {
    bindInventoryAutoCalc();
    bindGenericAutoCalc();
  }

  window.WOSCalcCore = {
    registerAdapter,
    run,
    runActive,
    runAll
  };
})();

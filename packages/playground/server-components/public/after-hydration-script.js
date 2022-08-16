'use strict';
(function () {
  const target = document.querySelector('section.after-hydration');
  if (target) {
    target.style = 'border: 1px solid green; padding: 1em; margin-top: 1rem;';
    target.innerHTML = `
      <small>Injected by <code> Script tag</code><br />reload: <code>false</code><br />strategy: <code>afterHydration</code></small>
      <h1 style="color: blue;">Loaded after-hydration-script.js via Script tag 🌊</h1>
    `;
  }
  console.log('🌊 <Script afterHydration src /> loaded, injecting code..');
})();

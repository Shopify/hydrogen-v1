'use strict';
(function () {
  const target = document.querySelector('section.on-idle-hydration');
  if (target) {
    target.style = 'border: 1px solid green; padding: 1em; margin-top: 1rem;';
    target.innerHTML = `
      <small>Injected by <code> Script tag</code><br />reload: <code>false</code><br />strategy: <code>onIdle</code></small>
      <h1 style="color: blue;">Loaded on-idle-hydration-script.js via Script 🕰</h1>
    `;
  }
  console.log('🕰 <Script onIdle src /> loaded, injecting html..');
})();

'use strict';
(function () {
  const target = document.querySelector('section.on-idle');
  if (target) {
    target.style = 'border: 1px solid green; padding: 1em; margin-top: 1rem;';
    target.innerHTML = `
      <small>Injected by <code> Script tag</code><br />reload: <code>❌</code><br />strategy: <code>onIdle</code></small>
      <h1 style="color: blue;">Injected by on-idle-script.js via <Script onIdle /> 🕰</h1>
    `;
  }
  console.log('🏖 <Script onIdle src /> loaded, injecting html..');
})();

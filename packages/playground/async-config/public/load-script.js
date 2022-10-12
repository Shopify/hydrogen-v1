'use strict';
(function () {
  const target = document.querySelector('div.load-script');
  target.style = 'border: 1px solid green; padding: 1em; margin-top: 1rem;';
  target.innerHTML = `
    <small>Injected by <code>loadScript</code> reload: <code>false</code></small>
    <h1 style="color: green;">Loaded load-script.js 🌎</h1>
  `;
  console.log('🌎 load-script loaded, injecting code..');
})();

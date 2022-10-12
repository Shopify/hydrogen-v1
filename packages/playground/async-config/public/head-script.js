// Simulate a big script that injects into the dom
'use strict';
(function () {
  const target = document.querySelector('section.head-script');
  target.style = 'border: 1px solid green; padding: 1em; margin-top: 1rem;';
  target.innerHTML = `
    <small>Injected by <code>Script tag</code><br />target: <code>head</code><br />reload: <code>false</code><br />strategy: <code>afterHydration<code></small>
    <h1 style="color: purple;">Loaded head-script.js in the head via Script tag 🙆</h1>
  `;
  console.log(
    '🙆 <Script target="head" afterHydration> loaded, injecting code..'
  );
})(window);

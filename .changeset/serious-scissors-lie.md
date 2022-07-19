---
'@shopify/hydrogen': patch
---

Added a new experimental CSS approach to support importing styles directly in React Server Component. This feature must be enabled manually.

Until now, we had experimental support for CSS Modules with some minor restrictions and drawbacks:

- Only server components that were the default export had access to the CSS Module automatically (i.e. it required extra work for named exports).
- CSS Module was duplicated when used in multiple components.
- RSC responses had all the CSS inlined, making them much larger.

The new CSS approach adds full support for CSS Modules without the previous restrictions and drawbacks.

Aside from that, it also adds support for pure CSS and enables a way to integrate with tools that provide CSS-in-JS at build time. All the CSS imported in both client and server components will be extracted in a CSS file at build time and downloaded with a `<link rel="stylesheet">` tag. During development, styles will be inlined in the DOM to better support HMR.

To activate this new experimental feature, pass the `experimental.css: 'global'` option to Hydrogen's Vite plugin:

```js
// vite.config.js
export default {
  plugins: [hydrogen({experimental: {css: 'global'}})],
};
```

Examples:

```jsx
// App.server.jsx using pure CSS with global classes
import './my-red-style.css';

function App() {
  return <div className="red">...</div>;
}
```

```jsx
// App.server.jsx using CSS Modules with scoped classes
import {red} from './my-red.module.css';

function App() {
  return <div className={red}>...</div>;
}
```

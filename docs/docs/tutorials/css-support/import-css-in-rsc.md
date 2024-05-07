# Importing CSS in React Server Components


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



<aside class="note beta">
<h4>Experimental feature</h4>

<p>Importing CSS in React Server Components is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

Hydrogen collects styles for each CSS file imported in your client and server components.

## Modify modes for CSS support

You can modify the following modes for CSS support by passing `experimental.css` option to the Hydrogen plugin in `vite.config.js`:


```js
// vite.config.js

export default defineConfig({
  plugins: [hydrogen({experimental: {css: 'global'}})]
})
```



- **`modules-only`**: Enables limited support for CSS Modules only. This is the current default mode.
- **`global`**: Enables full support for vanilla CSS and CSS Modules. `global` also enables a way to integrate with tools that provide CSS-in-JS at build time. This is the recommended mode.

> Note:
> CSS code split for different routes is not currently supported.

## Import Vanilla (pure) CSS and extensions

Vanilla CSS and language extensions such as [Sass](https://sass-lang.com/), [Less](https://lesscss.org/), and [Stylus](https://stylus-lang.com/) are supported under the `experimental.css: 'global'` feature.

Once enabled, you can import your stylesheets directly in your server components:

```jsx
// App.server.jsx

import './my-style.css';
import './another-style.sass';

function App() {
  return <div>...</div>
}
```



## Import CSS Modules

Hydrogen collects styles for each CSS Module in your components. CSS Modules can be imported in both client and server components.

```js
// src/components/Hello.server.jsx

import {red} from './styles.module.css';

export default function MyComponent() {
  return (
    <div className={red}>
      <p>Hello</p>
    </div>
  );
}
```



When the CSS mode is `modules-only`, styles are inlined in a `<style>` tag before your component. This tag is only added automatically for the default export in the file. Consider using the `global` CSS mode to support named exports and reduce code duplication.

## CSS-in-JS libraries

Hydrogen supports CSS-in-JS libraries that emit `.css` files at build time using third-party Vite plugins. Please reach out to the library maintainers to ask for React Server Components support, and feel free to tag the Hydrogen team (`@shopify/hydrogen`).

However, CSS-in-JS libraries that collect styles at runtime aren't currently supported due to limitation integrating these libraries with React Server Components.

## Next steps

- Explore an [example implementation of CSS Modules in GitHub](https://github.com/Shopify/hydrogen/tree/main/examples/css-modules).

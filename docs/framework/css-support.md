---
gid: ea75625d-0b47-4f83-a010-848f7eb8d273
title: Built-in CSS support
description: Learn about the CSS support built into Hydrogen.
---

Hydrogen's [Demo Store template](https://shopify.dev/custom-storefronts/hydrogen/templates) is styled using the [Tailwind CSS](https://tailwindcss.com/) utility library. This guide describes the benefits of using Tailwind and how to remove it if you prefer to use another CSS framework.

## How it works

You can build with Tailwind's library or use other methods of styling like vanilla CSS or [CSS Modules](#css-modules). All the CSS imported in the app will be extracted at build time as a single asset.

> Note:
> Make sure to import your stylesheets from a `*.client.jsx` component, or directly from `index.html`.

## Tailwind

Tailwind is a CSS framework that is composed of classes. It offers developers a set of guardrails by providing a limited set of spacing, color, and responsive layout utilities.

### Styling components

[Tailwind utility classes](https://tailwindcss.com/docs/utility-first) describe how a component should be displayed. Instead of accessing a stylesheets folder, and cross-referencing a classname, you can simply add class names. This means that your JavaScript logic, templating, and styles can be located in a single place.

The following example shows Tailwind classes in use:

{% codeblock file, filename: 'src/components/Welcome.server.jsx' %}

```html
// The text is centered.
<div class="text-center">
  // The heading is larger than normal text, has a small margin below it, and is bold.
  <h2 class="text-lg mb-4 font-bold">Hello, Hydrogen</h2>
  // The paragraph text is grey. Specifically, it’s the 600 shade of gray (100 is lightest and 900 is darkest).
  <p class="text-gray-600">Welcome to your custom storefront. Let's get building.</p>
</div>
```

{% endcodeblock %}

### Human-readable class names

Tailwind utility classes are concise, yet human-readable. For example, `block` in Tailwind is the same as `display: block` in CSS.

### Customizable classes

Tailwind utility classes can be customized to meet your needs. For example, you can define different shades of blue in a [configuration file](https://tailwindcss.com/docs/configuration) so that when Tailwind classes are generated, your custom shade of blue is used. This allows you to keep Tailwind’s pre-defined utility classes without requiring other developers to learn all of your color variables.

### Autocompleted class names

If you use Tailwind with [Visual Studio Code](https://code.visualstudio.com/), then you can see a preview of the color palette and what CSS properties the class name will apply.

### Remove Tailwind

If you don't want to build with Tailwind's library and instead want to write your own CSS, then you can remove Tailwind:

1. Delete all the code in `src/index.css`.
2. Remove Tailwind from `package.json`.
3. Remove Tailwind from `postcss.config.js`.
4. Run the following commands:

    {% codeblock terminal %}

    ```bash?filename: 'Terminal', title: 'npm'
    // Switch to your app's directory
    cd <directory>

    // Install dependencies
    npm i

    // Start the development server
    npm run dev
    ```

    ```bash?filename: 'Terminal', title: 'Yarn'
    // Switch to your app's directory
    cd <directory>

    // Install dependencies
    yarn

    // Start the development server
    yarn dev
    ```

    {% endcodeblock %}

## Custom fonts

If you want to use a font that's not included in Shopify's font library, then you can use fonts from third-party solutions such as [Typekit](https://fonts.adobe.com/fonts):

1. Add font files inside the `/public` folder. For example, add font files to `/public/fonts`.
2. Create a `.css` file that loads the local custom font and reference the font with `url()`:

    {% codeblock file, filename: 'custom-font.css' %}

    ```js
    /* fraunces-regular - latin */
    @font-face {
      font-family: 'Fraunces';
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url('/fonts/fraunces-v22-latin-regular.eot'); /* IE9 Compat Modes */
      src: local(''),
        url('/fonts/fraunces-v22-latin-regular.eot?#iefix')
          format('embedded-opentype'),
        /* IE6-IE8 */ url('/fonts/fraunces-v22-latin-regular.woff2') format('woff2'),
        /* Super Modern Browsers */ url('/fonts/fraunces-v22-latin-regular.woff')
          format('woff'),
        /* Modern Browsers */ url('/fonts/fraunces-v22-latin-regular.ttf')
          format('truetype'),
        /* Safari, Android, iOS */
          url('/fonts/fraunces-v22-latin-regular.svg#Fraunces') format('svg'); /* Legacy iOS */
    }
    ```

    {% endcodeblock %}

3. Import your `.css` file into `index.html` or any desired client component.

## Using CSS

<aside class="note beta">
<h4>Experimental feature</h4>

<p>Importing CSS in React Server Components is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

Hydrogen collects styles for each CSS file imported in your client and server components.
You can modify the following modes for CSS support by passing `experimental.css` option to the Hydrogen plugin in `vite.config.js`:

{% codeblock file, filename: 'vite.config.js' %}

```
export default defineConfig({
  plugins: [hydrogen({experimental: {css: 'global'}})]
})
```

{% endcodeblock %}

- **`modules-only`**: Enables limited support for CSS Modules only. This is the current default mode.
- **`global`**: Enables full support for vanilla CSS and CSS Modules. `global` also enables a way to integrate with tools that provide CSS-in-JS at build time. This is the recommended mode.

> Note:
> CSS code split for different routes is not currently supported.

### Vanilla (pure) CSS and extensions

Vanilla CSS and language extensions such as [Sass](https://sass-lang.com/), [Less](https://lesscss.org/), and [Stylus](https://stylus-lang.com/) are supported under the `experimental.css: 'global'` feature.

Once enabled, you can import your stylesheets directly in your server components:


{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import './my-style.css';
import './another-style.sass';

function App() {
  return <div>...</div>
}
```

{% endcodeblock %}

### CSS Modules

Hydrogen collects styles for each CSS Module in your components. CSS Modules can be imported in both client and server components.

{% codeblock file, filename: 'src/components/Hello.server.jsx' %}

```js
import {red} from './styles.module.css';

export default function MyComponent() {
  return (
    <div className={red}>
      <p>Hello</p>
    </div>
  );
}
```

{% endcodeblock %}

When the CSS mode is `modules-only`, styles are inlined in a `<style>` tag before your component. This tag is only added automatically for the default export in the file. Consider using the `global` CSS mode to support named exports and reduce code duplication.

### CSS-in-JS libraries

Hydrogen supports CSS-in-JS libraries that emit `.css` files at build time via third-party Vite plugins. Please, reach out to the library maintainers to ask for React Server Components support and feel free to tag the Hydrogen team.

However, CSS-in-JS libraries that collect styles at runtime aren't currently supported due to limitation integrating these libraries with React Server Components.

## Next steps

- Explore an [example implementation of CSS Modules in GitHub](https://github.com/Shopify/hydrogen/tree/main/examples/css-modules).

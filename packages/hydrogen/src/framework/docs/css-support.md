Hydrogen's [Demo Store template](/custom-storefronts/hydrogen/getting-started) is styled using the [Tailwind CSS](https://tailwindcss.com/) utility library. This guide describes the benefits of using Tailwind and how to remove it if you prefer to use another CSS framework.

## How it works

You can build with Tailwind's library or use other methods of styling like vanilla CSS files or a third-party CSS-in-JS framework like [CSS Modules](#css-modules). Hydrogen is powered by Vite, which natively supports several different [methods of CSS injection](https://vitejs.dev/guide/features.html#css).

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
  // The heading is larger than normal text, has a small margin below it, and is
  bold.
  <h2 class="text-lg mb-4 font-bold">Hello, Hydrogen</h2>
  // The paragraph text is grey. Specifically, it’s the 600 shade of gray (100
  is lightest and 900 is darkest).
  <p class="text-gray-600">
    Welcome to your custom storefront. Let's get building.
  </p>
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

   ```bash?filename: 'Terminal', title: 'yarn'
   // Switch to your app's directory
   cd <directory>

   // Install dependencies
   yarn

   // Start the development server
   yarn dev
   ```

   ```bash?filename: 'Terminal', title: 'npm'
   // Switch to your app's directory
   cd <directory>

   // Install dependencies
   npm i --legacy-peer-deps

   // Start the development server
   npm run dev
   ```

   {% endcodeblock %}

## CSS Modules

Hydrogen includes a [Vite plugin](https://vitejs.dev/guide/features.html#css-modules) that collects styles for each CSS Module and exports them to a `StyleTag` component. To use CSS Modules in your Hydrogen app, you must render the style tag in the component along with your styles:

{% codeblock file, filename: 'src/components/Hello.client.jsx' %}

```js
import * as styles from './styles.module.css';

export default MyComponent() {
  return (
    <div className={styles.wrapper}>
      // A style is rendered inline
      <styles.StyleTag />
      <p>Hello</p>
    </div>
  );
}
```

{% endcodeblock %}

> Tip:
> Explore an [example implementation of CSS Modules in GitHub](https://github.com/Shopify/hydrogen/tree/main/examples/css-modules).

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.

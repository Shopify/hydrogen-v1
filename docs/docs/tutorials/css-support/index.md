# Built-in CSS support


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen's [Demo Store template](/tutorials/getting-started/templates/) is styled using the [Tailwind CSS](https://tailwindcss.com/) utility library. This guide describes the benefits of using Tailwind and how to remove it if you prefer to use another CSS framework.

## How it works

You can build with Tailwind's library or use other methods of styling like vanilla CSS or [CSS Modules](custom-storefronts/hydrogen/css-support/import-css-in-rsc#modify-modes-for-css-support). All CSS that's imported in the app is extracted as a single asset at build time.

> Note:
> Make sure to import your stylesheets from a `*.client.jsx` component, or directly from `index.html`.

## Tailwind

Tailwind is a CSS framework that is composed of classes. It offers developers a set of guardrails by providing a limited set of spacing, color, and responsive layout utilities. If you don't want to use Tailwind, you can [remove it](/tutorials/css-support/remove-tailwind/)

### Styling components

[Tailwind utility classes](https://tailwindcss.com/docs/utility-first) describe how a component should be displayed. Instead of accessing a stylesheets folder, and cross-referencing a classname, you can simply add class names. This means that your JavaScript logic, templating, and styles can be located in a single place.

The following example shows Tailwind classes in use:

```html
<!-- src/components/Welcome.server.jsx -->

<!-- The text is centered. -->
<div class="text-center">
  <!-- The heading is larger than normal text, has a small margin below it, and is bold. -->
  <h2 class="text-lg mb-4 font-bold">Hello, Hydrogen</h2>
  <!-- The paragraph text is grey. Specifically, it’s the 600 shade of gray (100 is lightest and 900 is darkest). -->
  <p class="text-gray-600">Welcome to your custom storefront. Let's get building.</p>
</div>
```



### Human-readable class names

Tailwind utility classes are concise, yet human-readable. For example, `block` in Tailwind is the same as `display: block` in CSS.

### Customizable classes

Tailwind utility classes can be customized to meet your needs. For example, you can define different shades of blue in a [configuration file](https://tailwindcss.com/docs/configuration) so that when Tailwind classes are generated, your custom shade of blue is used. This allows you to keep Tailwind’s pre-defined utility classes without requiring other developers to learn all of your color variables.

### Autocompleted class names

If you use Tailwind with [Visual Studio Code](https://code.visualstudio.com/), then you can see a preview of the color palette and what CSS properties the class name will apply.

## Custom fonts

If you want to use a font that's not included in Shopify's font library, then you can use fonts from third-party solutions such as [Typekit](https://fonts.adobe.com/fonts). Learn how to [create custom fonts](/tutorials/css-support/create-custom-fonts/)

## Using CSS

Hydrogen collects styles for each CSS file imported in your client and server components. You can [modify the modes](/tutorials/css-support/import-css-in-rsc/) for CSS support.

## Next steps

- Learn how to [modify the modes](/tutorials/css-support/import-css-in-rsc/) for CSS support.

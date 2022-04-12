<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/ShopifyProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `ShopifyProvider` component wraps your entire app and provides support for hooks.
You should place it in your app's entry point component. For example, `&lt;App&gt;`.

## Example code

```tsx
import {ShopifyProvider} from '@shopify/hydrogen';

export default function App() {
  return <ShopifyProvider>{/* Routes, Pages, etc */}</ShopifyProvider>;
}
```

## Props

| Name           | Type                                   | Description                                    |
| -------------- | -------------------------------------- | ---------------------------------------------- |
| shopifyConfig? | <code>HydrogenConfig['shopify']</code> | The contents of the `hydrogen.config.js` file. |
| children?      | <code>React</code>                     | Any `ReactNode` elements.                      |
| any?           | <code>any</code>                       | PLACEHOLDER DESCRIPTION                        |

## Component type

The `ShopifyProvider` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Considerations

- `ShopifyProvider` is specific to Hydrogen and currently doesn't work in Next.js or other frameworks.
- You can't have multiple instances of `ShopifyProvider` within your app. Because it's not using `Context` (which isn't currently supported in server components), all `<ShopifyProvider>` instances share the same configuration for each request.
- You can dynamically define the configuration (`shopifyConfig` prop) for each request to the server. This is useful for aggregating multiple storefronts with a single Hydrogen app.

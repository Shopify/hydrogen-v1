<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/ShopifyProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `ShopifyProvider` component wraps your entire app and provides support for hooks.
You should place it in your app's entry point component. For example, `&lt;App&gt;`.

## Example code

```tsx
import {ShopifyProvider} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';

export default function App() {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      {/* Routes, Pages, etc */}
    </ShopifyProvider>
  );
}
```

## Props

| Name          | Type                                                    | Description                                   |
| ------------- | ------------------------------------------------------- | --------------------------------------------- |
| shopifyConfig | <code><a href="#shopifyconfig">ShopifyConfig</a></code> | The contents of the `shopify.config.js` file. |
| children?     | <code>React</code>                                      | Any `ReactNode` elements.                     |

## Component type

The `ShopifyProvider` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Considerations

- You can't have multiple instances of `ShopifyProvider` within your app. Because it's not using `Context` (which isn't currently supported in server components), all `<ShopifyProvider>` instances share the same configuration per request.
- You can dynamically define the configuration (`shopifyConfig` prop) for each request to the server. This is useful for aggregating multiple storefronts with a single Hydrogen app.

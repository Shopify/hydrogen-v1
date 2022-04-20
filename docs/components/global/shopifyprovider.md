---
gid: b4dc58a2-fafe-11eb-9a03-0242ac130003
title: ShopifyProvider
description: The ShopifyProvider component wraps your entire app and provides support for hooks.
---

The `ShopifyProvider` component wraps your entire app and provides support for hooks. You should place it in your app's entry point component. For example, `&lt;App&gt;`. If you're using the Hydrogen framework, then you don't need to add this provider because it's automatically wrapped around your app in `renderHydrogen()`.

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

| Name          | Type                       | Description                                   |
| ------------- | -------------------------- | --------------------------------------------- |
| shopifyConfig | <code>ShopifyConfig</code> | The contents of the `shopify.config.js` file. |
| children?     | <code>React</code>         | Any `ReactNode` elements.                     |

## Component type

The `ShopifyProvider` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Considerations

- `ShopifyProvider` is specific to Hydrogen and currently doesn't work in Next.js or other frameworks.
- You can't have multiple instances of `ShopifyProvider` within your app. Because it's not using `Context` (which isn't currently supported in server components), all `<ShopifyProvider>` instances share the same configuration for each request.
- You can dynamically define the configuration (`shopifyConfig` prop) for each request to the server. This is useful for aggregating multiple storefronts with a single Hydrogen app.

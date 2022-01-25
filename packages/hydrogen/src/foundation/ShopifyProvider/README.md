<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/ShopifyProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `ShopifyProvider` component wraps your entire app and provides support for hooks.
You should place it in your app's entry point component. For example, `&lt;App&gt;`.
If you're using the Hydrogen framework, you don't need to add this provider
because it's automatically wrapped around your app in `renderHydrogen()`.

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

| Props           | Description                              |
| --------------- | ---------------------------------------- |
| `shopifyConfig` | The content of `shopify.config.js` file. |
| `children`      | The rest of the application.             |

## Component type

The `ShopifyProvider` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

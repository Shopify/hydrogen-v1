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

The `ShopifyProvider` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

Note: Context is not yet available in React Server Components. `ShopifyProvider` is a _special_ exception. If using it in the hydrogen framework, make sure that you only have one instance in your app. This is because it isn't using real context, and all instances share the same context inside React Server Components.

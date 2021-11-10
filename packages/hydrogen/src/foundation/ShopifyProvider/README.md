<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/ShopifyProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `ShopifyProvider` component wraps your entire app and provides support for hooks. You should place it in your app's entry point component. For example, `<App>`.

## Component type

The `ShopifyProvider` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Example code

{% codeblock file %}

```jsx
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

{% endcodeblock %}

## Props

| Name            | Required | Description                                   |
| --------------- | -------- | --------------------------------------------- |
| `shopifyConfig` | Yes      | The contents of the `shopify.config.js` file. |

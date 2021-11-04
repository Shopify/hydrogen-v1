---
gid: b4dc58a2-fafe-11eb-9a03-0242ac130003
title: ShopifyProvider
description: Use the ShopifyProvider component to wrap your entire app and provide support for hooks.
---

The `ShopifyProvider` component wraps your entire app and provides support for hooks. You should place it in your app's entry point component. For example, `<App>`.

## Component type

The `ShopifyProvider` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

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

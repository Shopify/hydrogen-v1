<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/RawHtml and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `RawHtml` component renders an HTML string as HTML DOM elements. This should be used for
displaying rich text-like descriptions associated with a product.

This component uses `dangerouslySetInnerHTML`. In general, setting HTML from code is risky
because it’s easy to inadvertently expose your users to a
[cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack.

## Example code

```tsx
import {RawHtml} from '@shopify/hydrogen';

export function MyComponent() {
  return <RawHtml dangerouslySetInnerHTML="<p>Hello world</p>" />;
}
```

## Props

| Name                    | Type                | Description                                                                   |
| ----------------------- | ------------------- | ----------------------------------------------------------------------------- |
| dangerouslySetInnerHTML | <code>string</code> | An HTML string.                                                               |
| as?                     | <code>TTag</code>   | An HTML tag to be rendered as the base element wrapper. The default is `div`. |

## Component type

The `RawHtml` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Used by

- [`ProductDescription`](/api/hydrogen/components/product-variant/productdescription)

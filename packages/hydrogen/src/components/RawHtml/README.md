<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/RawHtml and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `RawHtml` component renders an HTML string as HTML DOM elements. This should be used for
displaying rich text-like descriptions associated with a product.

The string passed to `RawHtml` is sanitized with
[isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify) by default.
To keep the text unsanitized, set the `unsanitized` prop to `true`.

## Example code

```tsx
import {RawHtml} from '@shopify/hydrogen';

export function MyComponent() {
  return <RawHtml string="<p>Hello world</p>" />;
}
```

## Props

| Name         | Type                     | Description                                                                          |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------ |
| string       | <code>string</code>      | An HTML string.                                                                      |
| unsanitized? | <code>boolean</code>     | Whether the HTML string should be sanitized with `isomorphic-dompurify`.             |
| as?          | <code>ElementType</code> | An HTML ElementType to be rendered as the base element wrapper. The default is 'div' |

## Component type

The `RawHtml` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Used by

- [`ProductDescription`](/api/hydrogen/components/product-variant/productdescription)

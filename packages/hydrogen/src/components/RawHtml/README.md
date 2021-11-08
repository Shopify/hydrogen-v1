<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/RawHtml and run 'yarn generate-docs' at the root of this repo. -->

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

| Name         | Type                 | Description                                                              |
| ------------ | -------------------- | ------------------------------------------------------------------------ |
| string       | <code>string</code>  | An HTML string.                                                          |
| unsanitized? | <code>boolean</code> | Whether the HTML string should be sanitized with `isomorphic-dompurify`. |

## Component type

The `RawHtml` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Used by

- [`ProductDescription`](/api/hydrogen/components/product-variant/productdescription)

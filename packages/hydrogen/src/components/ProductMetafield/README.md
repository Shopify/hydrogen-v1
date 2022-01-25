<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/ProductMetafield and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `ProductMetafield` component renders a
[`Metafield`](/api/hydrogen/components/primitive/metafield) component with the product metafield.
It must be a descendent of a `ProductProvider` component.

## Example code

```tsx
import {ProductProvider, ProductMetafield} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider product={product}>
      <ProductMetafield namespace="my_fields" keyName="manufacture_date" />
    </ProductProvider>
  );
}

export function ProductWithRenderProp({product}) {
  return (
    <ProductProvider product={product}>
      <ProductMetafield namespace="my_fields" keyName="manufacture_date">
        {({value}) => {
          return (
            <p>This product was manufactured on {value.toLocaleDateString()}</p>
          );
        }}
      </ProductMetafield>
    </ProductProvider>
  );
}
```

## Props

| Name      | Type                   | Description                                                                                                               |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| keyName   | <code>string</code>    | A string corresponding to the [key](/api/storefront/reference/common-objects/metafield) of the product's metafield.       |
| namespace | <code>string</code>    | A string corresponding to the [namespace](/api/storefront/reference/common-objects/metafield) of the product's metafield. |
| children? | <code>ReactNode</code> | A render function that takes a `Metafield` object as its argument.                                                        |

## Component type

The `ProductMetafield` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`Metafield`](/api/hydrogen/components/primitive/metafield)

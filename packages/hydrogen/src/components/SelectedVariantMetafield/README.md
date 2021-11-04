<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/SelectedVariantMetafield and run 'yarn generate-docs' at the root of this repo. -->

The `SelectedVariantMetafield` component renders a [`Metafield`](/api/hydrogen/components/primitive/metafield)
component with the selected product's metafield.
It must be a descendent of a `ProductProvider` component.

## Example code

```tsx
import {ProductProvider, SelectedVariantMetafield} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider product={product}>
      <SelectedVariantMetafield
        namespace="my_fields"
        keyName="manufacture_date"
      />
    </ProductProvider>
  );
}

export function ProductWithRenderProp({product}) {
  return (
    <ProductProvider product={product}>
      <SelectedVariantMetafield
        namespace="my_fields"
        keyName="manufacture_date"
      >
        {({value}) => {
          return (
            <p>This variant was manufactured on {value.toLocaleDateString()}</p>
          );
        }}
      </SelectedVariantMetafield>
    </ProductProvider>
  );
}
```

## Props

| Name      | Type                   | Description                                                                                                                        |
| --------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| keyName   | <code>string</code>    | A string corresponding to the [key](/api/storefront/reference/common-objects/metafield) of the selected variant's metafield.       |
| namespace | <code>string</code>    | A string corresponding to the [namespace](/api/storefront/reference/common-objects/metafield) of the selected variant's metafield. |
| children? | <code>ReactNode</code> | A render function that takes a `Metafield` object as its argument.                                                                 |

## Component type

The `SelectedVariantMetafield` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`Metafield`](/api/hydrogen/components/primitive/metafield)

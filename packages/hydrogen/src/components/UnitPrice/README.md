<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/UnitPrice and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `UnitPrice` component renders a string with a [UnitPrice](/themes/pricing-payments/unit-pricing) as the
Storefront API's [MoneyV2 object](/api/storefront/reference/common-objects/moneyv2) with a reference unit from the Storefront API's [UnitPriceMeasurement object](/api/storefront/reference/products/unitpricemeasurement).

## Example code

```tsx
import {UnitPrice} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  productByHandle(handle: "my-product") {
    variants(first: 1) {
      edges {
        node {
          unitPriceMeasurement {
            measuredType
            quantityUnit
            quantityValue
            referenceUnit
            referenceValue
          }
          unitPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export default function Product() {
  const {data} = useShopQuery({query: QUERY});
  const selectedVariant = data.product.variants.edges[0].node;

  return (
    <UnitPrice
      data={selectedVariant.unitPrice}
      measurement={selectedVariant.unitPriceMeasurement}
    />
  );
}
```

## Props

| Name        | Type                                                      | Description                                                                                                                     |
| ----------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| data        | <code>UnitPriceFragmentFragment['unitPrice']</code>       | An object with keys that correspond to the Storefront API's [MoneyV2 object](/api/storefront/reference/common-objects/moneyv2). |
| measurement | <code>UnitPriceMeasurement['unitPriceMeasurement']</code> | A [UnitPriceMeasurement object](/api/storefront/reference/products/unitpricemeasurement).                                       |
| as?         | <code>TTag</code>                                         | An HTML tag to be rendered as the base element wrapper. The default is `div`.                                                   |

## Component type

The `UnitPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `UnitPriceFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `UnitPrice` component.

```graphql
fragment UnitPriceFragment on ProductVariant {
  unitPriceMeasurement {
    measuredType
    quantityUnit
    quantityValue
    referenceUnit
    referenceValue
  }
  unitPrice {
    currencyCode
    amount
  }
}
```

## Related hooks

- [`useMoney`](/api/hydrogen/hooks/primitive/usemoney)

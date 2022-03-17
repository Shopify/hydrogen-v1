<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/UnitPrice and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

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

| Name        | Type                                                   | Description                                                                                                                       |
| ----------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| data        | <code>PartialDeep&#60;MoneyV2&#62;</code>              | An object with fields that correspond to the Storefront API's [MoneyV2 object](/api/storefront/reference/common-objects/moneyv2). |
| measurement | <code>PartialDeep&#60;UnitPriceMeasurement&#62;</code> | A [UnitPriceMeasurement object](/api/storefront/reference/products/unitpricemeasurement).                                         |
| as?         | <code>TTag</code>                                      | An HTML tag to be rendered as the base element wrapper. The default is `div`.                                                     |

## Component type

The `UnitPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [MoneyV2 object](/api/storefront/reference/common-objects/moneyv2):

```graphql
{
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

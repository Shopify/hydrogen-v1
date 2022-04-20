---
gid: 00cc1a1b-a0fa-4ae0-87f3-3f8f2e245ef5
title: UnitPrice
description: The UnitPrice component renders a string with a UnitPrice as the Storefront API's MoneyV2 object with a reference unit from the Storefront API's UnitPriceMeasurement object.
---

The `UnitPrice` component renders a string with a [UnitPrice](https://shopify.dev/themes/pricing-payments/unit-pricing) as the
Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) with a reference unit from the Storefront API's [UnitPriceMeasurement object](https://shopify.dev/api/storefront/reference/products/unitpricemeasurement).

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

| Name        | Type                                                   | Description                                                                                                                                          |
| ----------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| data        | <code>PartialDeep&#60;MoneyV2&#62;</code>              | An object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2). |
| measurement | <code>PartialDeep&#60;UnitPriceMeasurement&#62;</code> | A [UnitPriceMeasurement object](https://shopify.dev/api/storefront/reference/products/unitpricemeasurement).                                         |
| as?         | <code>TTag</code>                                      | An HTML tag to be rendered as the base element wrapper. The default is `div`.                                                                        |

## Component type

The `UnitPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2):

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

- [`useMoney`](https://shopify.dev/api/hydrogen/hooks/primitive/usemoney)

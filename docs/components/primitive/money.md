---
gid: 5819262c-fafe-11eb-9a03-0242ac130003
title: Money
description: The Money component renders a string of the Storefront API's MoneyV2 object according to the locale in the Shopify config file.
---

The `Money` component renders a string of the Storefront API's
[MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) according to the
`defaultLocale` in the [the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).

## Example code

```tsx
import {Money} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  productByHandle(handle: "my-product") {
    variants(first: 1) {
      edges {
        node {
          priceV2 {
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

  return <Money data={data.product.variants.edges[0].node.priceV2} />;
}
```

### Example with `measurement`:

```tsx
import {Money} from '@shopify/hydrogen';
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
    <Money
      data={selectedVariant.unitPrice}
      measurement={selectedVariant.unitPriceMeasurement}
      measurementSeparator="-"
    />
  );
}
```

## Props

| Name | Type                                      | Description                                                                                                                                          |
| ---- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| as?  | <code>TTag</code>                         | An HTML tag to be rendered as the base element wrapper. The default is `div`.                                                                        |
| withoutCurrency? | <code>boolean</code> | Whether to remove the currency symbol from the output. |
| withoutTrailingZeros? | <code>boolean</code> | Whether to remove trailing zeros (fractional money) from the output. If there are no trailing zeros, then the fractional money amount remains. For example, `$640.00` turns into `$640`. `$640.42` turns into `$640.42`. |
| data | <code>PartialDeep&#60;MoneyV2&#62;</code> | An object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2). |
| measurement | <code>PartialDeep&#60;UnitPriceMeasurement&#62;</code> | A [UnitPriceMeasurement object](https://shopify.dev/api/storefront/reference/products/unitpricemeasurement). |
| measurementSeparator | <code>ReactNode</code> | When the `measurement` prop is used, `measurementSeparator` allows you to customize the separator between the money output and the measurement output. Defaults to `'/'` |


## Component type

The `Money` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2):

```graphql
{
  currencyCode
  amount
}
```

## Related hooks

- [`useMoney`](https://shopify.dev/api/hydrogen/hooks/primitive/usemoney)

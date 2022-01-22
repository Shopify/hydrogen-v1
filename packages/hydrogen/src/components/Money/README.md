<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Money and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `Money` component renders a string of the Storefront API's
[`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2) according to the
`defaultLocale` in the `shopify.config.js` file. If `children` is a function, then it will
provide render props for the `children` corresponding to the object returned by the `useMoney` hook.

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

  return <Money money={data.product.variants.edges[0].node.priceV2} />;
}

export default function ProductWithCustomMoney() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <Money money={data.product.variants.edges[0].node.priceV2}>
      {({amount, currencyCode, currencyNarrowSymbol}) => {
        return (
          <>
            <span>{`${currencyNarrowSymbol}${amount}`}</span>
            <span>{currencyCode}</span>
          </>
        );
      }}
    </Money>
  );
}
```

## Props

| Name      | Type                     | Description                                                                              |
| --------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| as?       | <code>ElementType</code> | A `ReactNode` element.                                                                   |
| money     | <code>MoneyV2</code>     | A [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2).                  |
| children? | <code>ReactNode</code>   | A function that takes an object return by the `useMoney` hook and returns a `ReactNode`. |

## Component type

The `Money` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MoneyFragment` or `Money.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `Money` component.

```graphql
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}
```

## Related hooks

- [`useMoney`](/api/hydrogen/hooks/primitive/usemoney)

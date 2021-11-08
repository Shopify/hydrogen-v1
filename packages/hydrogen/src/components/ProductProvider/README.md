<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/ProductProvider and run 'yarn generate-docs' at the root of this repo. -->

The `useProduct` hook returns the product object of the nearest `ProductProvider`. It must be a descendent of
a `ProductProvider` component.

## Example code

```tsx
import {ProductProvider} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  query product($handle: String!) {
    product: productByHandle(handle: $handle) {
      ...ProductProviderFragment
    }
  }

  ${ProductProviderFragment}
`;

export function Product() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <ProductProvider value={data.product.product}>
      {/* Your JSX */}
    </ProductProvider>
  );
}
```

## Alias

The `ProductProvider` component is aliased by the `Product` component. You can use whichever component you prefer.

## Component type

The `ProductProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## GraphQL fragment

The following GraphQL fragment is available for your GraphQL queries using `ProductProviderFragment` or `ProductProvider.Fragment`. Using this fragment in your queries ensures that you have all the data necessary for using the `ProductProvider`.

```graphql
fragment ProductProviderFragment on Product {
  compareAtPriceRange {
    maxVariantPrice {
      ...MoneyFragment
    }
    minVariantPrice {
      ...MoneyFragment
    }
  }
  descriptionHtml
  handle
  id
  media(first: $numProductMedia) {
    edges {
      node {
        ...MediaFileFragment
      }
    }
  }
  metafields(first: $numProductMetafields) {
    edges {
      node {
        ...MetafieldFragment
      }
    }
  }
  priceRange {
    maxVariantPrice {
      ...MoneyFragment
    }
    minVariantPrice {
      ...MoneyFragment
    }
  }
  title
  variants(first: $numProductVariants) {
    edges {
      node {
        ...VariantFragment
      }
    }
  }
  sellingPlanGroups(first: $numProductSellingPlanGroups) {
    edges {
      node {
        ...SellingPlanGroupsFragment
      }
    }
  }
}
```

### Variables

The `ProductProviderFragment` includes variables that you will need to provide values for when performing your query.

| Variable                                   | Description                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `$numProductMedia`                         | The number of `Media` objects to query for in a `MediaConnection`.                                    |
| `$numProductMetafields`                    | The number of `Metafields` objects to query for in a `MetafieldConnection`.                           |
| `$numProductVariants`                      | The number of `ProductVariant` objects to query for in a `ProductVariantConnection`.                  |
| `$numProductVariantMetafields`             | The number of `Metafield` objects to query for in a variant's `MetafieldConnection`.                  |
| `$numProductVariantSellingPlanAllocations` | The number of `SellingPlanAllocations` to query for in a variant's `SellingPlanAllocationConnection`. |
| `$numProductSellingPlanGroups`             | The number of `SellingPlanGroups` objects to query for in a `SellingPlanGroupConnection`.             |
| `$$numProductSellingPlans`                 | The number of `SellingPlan` objects to query for in a `SellingPlanConnection`.                        |

### Example query

```jsx
export default function Product() {
  const {handle} = useParams();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
      numProductMetafields: 10,
      numProductVariants: 250,
      numProductMedia: 6,
      numProductVariantMetafields: 10,
      numProductVariantSellingPlanAllocations: 10,
      numProductSellingPlanGroups: 10,
      numProductSellingPlans: 10,
    },
  });

  if (!data.product) {
    return <NotFound />;
  }

  return <ProductDetails data={data} />;
}

const QUERY = gql`
  query product(
    $handle: String!
    $numProductMetafields: Int!
    $numProductVariants: Int!
    $numProductMedia: Int!
    $numProductVariantMetafields: Int!
    $numProductVariantSellingPlanAllocations: Int!
    $numProductSellingPlanGroups: Int!
    $numProductSellingPlans: Int!
  ) {
    product: product(handle: $handle) {
      id
      vendor
      seo {
        title
        description
      }
      images(first: 1) {
        edges {
          node {
            url
          }
        }
      }
      ...ProductProviderFragment
    }
  }

  ${ProductProviderFragment}
`;
```

## Related components

- [`ProductTitle`](/api/hydrogen/components/product-variant/producttitle)
- [`ProductDescription`](/api/hydrogen/components/product-variant/productdescription)
- [`ProductPrice`](/api/hydrogen/components/product-variant/productprice)
- [`SelectedVariantPrice`](/api/hydrogen/components/product-variant/selectedvariantprice)
- [`SelectedVariantImage`](/api/hydrogen/components/product-variant/selectedvariantimage)
- [`SelectedVariantAddToCartButton`](/api/hydrogen/components/product-variant/selectedvariantaddtocartbutton)

## Related hooks

- [`useProduct`](/api/hydrogen/hooks/product-variant/useproduct)

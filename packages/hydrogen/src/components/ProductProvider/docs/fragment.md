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
| `$numProductSellingPlans`                  | The number of `SellingPlan` objects to query for in a `SellingPlanConnection`.                        |
| `$includeReferenceMetafieldDetails`        | A boolean indicating if the reference metafield details should be queried.                            |

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
      includeReferenceMetafieldDetails: false,
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

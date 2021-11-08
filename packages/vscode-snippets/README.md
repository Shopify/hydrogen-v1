# Hydrogen VSCode Snippets

## `usq`

Use `useShopQuery()`

```ts
const {data} = useShopQuery({query: QUERY});
```

## `sq`

New Storefront query

```ts
import gql from 'graphql-tag';

const QUERY = gql`
  query Query {
    ...
  }
`;
```

## `imph`

Import from hydrogen

```ts
import {...} from '@shopify/hydrogen';
```

## `hp`

New Hydrogen page

```tsx
function Page {
  return (
    <div>
      ...
    </div>
  )
}

export default Page;
```

## `ppfv`

`ProductProviderFragment` variables

```graphql
  $country: CountryCode
  $handle: String!
  $numProductMetafields: Int = 20
  $numProductVariants: Int = 250
  $numProductMedia: Int = 6
  $numProductVariantMetafields: Int = 10
  $numProductVariantSellingPlanAllocations: Int = 0
  $numProductSellingPlanGroups: Int = 0
  $numProductSellingPlans: Int = 0
```

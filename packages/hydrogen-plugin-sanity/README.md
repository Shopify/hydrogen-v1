# Sanity plugin for Hydrogen

## NOTICE: This plugin has been deprecated.

**Please use [hydrogen-plugin-sanity](https://www.npmjs.com/package/hydrogen-plugin-sanity) instead.**

---

This is a plugin for Hydrogen with Sanity. A `useSanityQuery` React hook with a API similar to `useShopQuery` is exposed to efficiently and ergonomically fetch data from a Sanity instance.

## Getting Started

To add the plugin as a dependency to your project:

```bash
yarn add @shopify/hydrogen-plugin-sanity
```

To fetch data from a Sanity instance:

```javascript
import {useSanityQuery} from '@shopify/hydrogen-plugin-sanity';

const {data} = useSanityQuery({
  query: gql`
    query product($ids: String!) {
      product: allProduct(where: {id: {in: $ids}}) {
        id
        vendor {
          title
        }
        upc
      }
    }
  `,
  variables: {ids: products.map((product) => product.id)},
});
```

The `useSanityQuery` hook knows which Sanity instance to query and authenticate against through the use of two environment variables: `VITE_SANITY_ID` and `VITE_SANITY_TOKEN`. Both of these environment variables must be set in order to fetch data with the `useSanityQuery` hook.

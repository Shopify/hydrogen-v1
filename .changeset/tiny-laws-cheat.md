---
'@shopify/hydrogen': minor
---

A new `gql` utility is exported from `@shopify/hydrogen` that replaces `graphql-tag` dependency when using `useShopQuery`. It helps reducing bundle size in production when compared to the original `graphql-tag`.

Before:

```js
import gql from 'graphql-tag';

// ...

useShopQuery({
  query: gql`...`,
  // ...
});
```

After:

```js
import {gql} from '@shopify/hydrogen';

// ...

useShopQuery({
  query: gql`...`,
  // ...
});
```

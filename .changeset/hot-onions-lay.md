---
'@shopify/hydrogen': patch
---

Updated the Typescript types and GraphQL schema to the newest updates from Storefront API 2022-04. Of note in this update is the ability to skip `edges` and go directly to `node`, for example: `product.nodes[0]` instead of `product.edges[0].node`

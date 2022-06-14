---
'@shopify/hydrogen': minor
---

`<Image/>` now takes into account a specific order for determining the width and height.

1. `loaderOptions`'s width/height
2. width/height bare props
3. `data`'s width/height

`getShopifyImageDimensions()` was also updated to handle this logic.

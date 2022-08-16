---
'@shopify/hydrogen': patch
---

`<ExternalVideo/>` now has a default prop of `loading="lazy"` to improve performance.

If you are using `<ExternalVideo/>` above the fold, then it's recommended to set this prop to `eager`.

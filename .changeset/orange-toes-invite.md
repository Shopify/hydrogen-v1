---
'@shopify/hydrogen': patch
---

`<ExternalVideo/>` now has a default prop of `loading="lazy"` to improve performance of the rendered `<iframe>`.

If you're using `<ExternalVideo/>` above the fold, then we recommend setting this prop to `eager`.

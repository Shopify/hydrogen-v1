---
'@shopify/hydrogen': minor
---

## `<Image/>`

The `<Image/>` component and related utility functions were reworked and the following changes apply:

- `useImageUrl` is no longer available; use `shopifyImageLoader` instead, which is available to run both server- and client-side.
- The TypeScript experience with `<Image/>` is improved; props will be validated better, and `loader` and `loaderOptions` will be better typed
- When using the `src` prop, `width` and `height` are now required
- When using the `data` prop, `data.width` and `data.height` or `width` and `height` props are required
- The `src` and `data` props are mutually exclusive
- The `loader` prop now receives a singular param as an object
- `options` is renamed to `loaderOptions`
- The TypeScript type `ImageSizeOptions` is now named `ShopifyLoaderOptions`
- The TypeScript type `ImageLoaderOptions` is now named `ShopifyLoaderParams`

## `<Video/>`

- The `<Video/>` component's `options` props was renamed to `imagePreviewOptions` to add clarity as to what the options were for.
- `imagePreviewOptions` matches the (newly updated) shape of `<Image/>`'s `loaderOptions`

---
'@shopify/hydrogen': patch
---

`@shopify/hydrogen` will no longer export the following types

- MediaFileProps
- VideoProps
- ImageProps
- ExternalVideoProps
- RawHtmlProps
- AddToCartButtonProps
- ModelViewerProps
- MoneyProps
- BuyNowButtonProps
- BuyNowButtonPropsWeControl
- ShopPayButtonProps

Any Component props type should be typed instead with `React.ComponentProps<typeof MyComponent>`.

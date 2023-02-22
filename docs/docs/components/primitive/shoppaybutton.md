# ShopPayButton


The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout. You can [customize this component](/components#customizing-hydrogen-components) using passthrough props.

## Example code

```tsx
import {ShopPayButton} from '@shopify/hydrogen';

export function MyProduct({variantId}) {
  return <ShopPayButton variantIds={[variantId]} />;
}
```

## Props

The `variantIds` and `variantIdsAndQuantities` props are mutually exclusive. You must pass either `variantIds` or `variantIdsAndQuantities` to the component - not both.

| Name                    | Type                                                                                             | Description                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| variantIds              | <pre>{ <br /> variantIds: string[]; <br /> variantIdsAndQuantities?: never;<br />}</pre>               | An array of IDs of the variants to purchase with Shop Pay. This will only ever have a quantity of 1 for each variant. If you want to use other quantities, then use `variantIdsAndQuantities`. |
| variantIdsAndQuantities | <pre>{ <br /> variantIds: never; <br /> variantIdsAndQuantities?: VariantIdAndQuantity[];<br />}</pre> | An array of variant IDs and quantities to purchase with Shop Pay.                                                                                                                              |
| className?              | `string`                                                                              | A string of classes to apply to the `div` that wraps the Shop Pay button.                                                                                                                      |
| width? | `string` |   A string that's applied to the [CSS custom property (variable)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) `--shop-pay-button-width` for the [Buy with Shop Pay component](https://shopify.dev/custom-storefronts/tools/web-components#buy-with-shop-pay-component). |


## Component type

The `ShopPayButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Used by

- [`CartShopPayButton`](/components/cart/cartshoppaybutton/)

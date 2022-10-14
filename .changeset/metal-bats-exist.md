---
'@shopify/hydrogen': minor
---

Updates `CartProvider` to use the new `CartProviderV2`. No code changes are necessary. [Docs for CartProvider can be found here.](https://shopify.dev/api/hydrogen/components/cart/cartprovider)

Also adds the following `onComplete` props callbacks:
| Name | Type | Description |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| onCreateComplete? | <code>() => void</code> | Invoked when the process to create a cart completes successfully |
| onLineAddComplete? | <code>() => void</code> | Invoked when the process to add a line item to the cart completes successfully |
| onLineRemoveComplete? | <code>() => void</code> | Invoked when the process to remove a line item to the cart completes successfully |
| onLineUpdateComplete? | <code>() => void</code> | Invoked when the process to update a line item in the cart completes successfully |
| onNoteUpdateComplete? | <code>() => void</code> | Invoked when the process to add or update a note in the cart completes successfully |
| onBuyerIdentityUpdateComplete? | <code>() => void</code> | Invoked when the process to update the buyer identity completes successfully |
| onAttributesUpdateComplete? | <code>() => void</code> | Invoked when the process to update the cart attributes completes successfully |
| onDiscountCodesUpdateComplete? | <code>() => void</code> | Invoked when the process to update the cart discount codes completes successfully |

import {CartProviderV2} from '@shopify/hydrogen/experimental';

export function CartProviderWrapper({children}: any) {
  return (
    <CartProviderV2
      onCreate={() => console.log('onCreate')}
      onLineAdd={() => console.log('onLineAdd')}
      onLineRemove={() => console.log('onLineRemove')}
      onLineUpdate={() => console.log('onLineUpdate')}
      onNoteUpdate={() => console.log('onLineUpdate')}
      onBuyerIdentityUpdate={() => console.log('onBuyerIdentityUpdate')}
      onAttributesUpdate={() => console.log('onAttributesUpdate')}
      onDiscountCodesUpdate={() => console.log('onDiscountCodesUpdate')}
    >
      {children}
    </CartProviderV2>
  );
}

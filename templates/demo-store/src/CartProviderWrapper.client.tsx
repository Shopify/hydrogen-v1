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
      onCreateComplete={() => console.log('onCreateComplete')}
      onLineAddComplete={() => console.log('onLineAddComplete')}
      onLineRemoveComplete={() => console.log('onLineRemoveComplete')}
      onLineUpdateComplete={() => console.log('onLineUpdateComplete')}
      onNoteUpdateComplete={() => console.log('onLineUpdateComplete')}
      onBuyerIdentityUpdateComplete={() =>
        console.log('onBuyerIdentityUpdateComplete')
      }
      onAttributesUpdateComplete={() =>
        console.log('onAttributesUpdateComplete')
      }
      onDiscountCodesUpdateComplete={() =>
        console.log('onDiscountCodesUpdateComplete')
      }
    >
      {children}
    </CartProviderV2>
  );
}

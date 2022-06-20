import {useRef} from 'react';
import {useScroll} from 'react-use';
import {
  useCart,
  CartLineProvider,
  CartShopPayButton,
  Money,
} from '@shopify/hydrogen';

import {Button, Text, CartLineItem, CartEmpty} from '~/components';

export function CartDetails({onClose}: {onClose?: () => void}) {
  const {lines} = useCart();
  const scrollRef = useRef(null);
  const {y} = useScroll(scrollRef);

  if (lines.length === 0) {
    return <CartEmpty onClose={onClose} />;
  }

  return (
    <form className="grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto]">
      <section
        ref={scrollRef}
        aria-labelledby="cart-contents"
        className={`px-4 pb-4 overflow-auto transition md:px-12 ${
          y > 0 && 'border-t'
        }`}
      >
        <ul className="grid gap-6 md:gap-10">
          {lines.map((line) => {
            return (
              <CartLineProvider key={line.id} line={line}>
                <CartLineItem />
              </CartLineProvider>
            );
          })}
        </ul>
      </section>
      <section
        aria-labelledby="summary-heading"
        className="p-4 border-t md:px-12"
      >
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>
        <OrderSummary />
        <CartCheckoutActions />
      </section>
    </form>
  );
}

function CartCheckoutActions() {
  const {checkoutUrl} = useCart();
  return (
    <>
      <div className="flex flex-col items-center mt-6 md:mt-8">
        <Button to={checkoutUrl} width="full">
          Continue to Checkout
        </Button>
        <CartShopPayButton className="flex items-center justify-center rounded-sm mt-2 bg-[#5a31f4]" />
      </div>
    </>
  );
}

function OrderSummary() {
  const {cost} = useCart();
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <Text as="dt">Subtotal</Text>
          <Text as="dd">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <Text as="dt" className="flex items-center">
            <span>Shipping estimate</span>
          </Text>
          <Text as="dd" className="text-green-600">
            Free and carbon neutral
          </Text>
        </div>
      </dl>
    </>
  );
}

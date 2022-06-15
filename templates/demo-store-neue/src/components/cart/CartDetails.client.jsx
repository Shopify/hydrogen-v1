import {useMemo, useRef} from 'react';
import {useScroll} from 'react-use';
import {
  useCart,
  useCartLine,
  CartLineProvider,
  CartShopPayButton,
  CartLineQuantityAdjustButton,
  CartLinePrice,
  CartLineQuantity,
  Image,
  Link,
  Money,
} from '@shopify/hydrogen';

import {Button, Heading, IconRemove, Text} from '~/components';

export function CartDetails({onClose}) {
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
  const {estimatedCost} = useCart();
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <Text as="dt">Subtotal</Text>
          <Text as="dd">
            {estimatedCost?.subtotalAmount?.amount ? (
              <Money data={estimatedCost?.subtotalAmount} />
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

function CartLineItem() {
  const {linesRemove} = useCart();
  const {id: lineId, quantity, merchandise} = useCartLine();

  const variantOptionsTitle = useMemo(
    () =>
      merchandise.selectedOptions
        .map((option) => `${option.name}: ${option.value}`)
        .join(', '),
    [merchandise.selectedOptions],
  );

  return (
    <li key={lineId} className="flex">
      <div className="flex-shrink-0">
        <Image
          data={merchandise.image}
          className="object-cover object-center w-24 h-24 border rounded md:w-28 md:h-28"
        />
      </div>

      <div className="flex justify-between flex-1 ml-4 sm:ml-6">
        <div className="relative grid gap-1">
          <Heading as="h3" size="copy">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </Heading>
          <div className="flex gap-2">
            <Text color="subtle">{variantOptionsTitle}</Text>
          </div>

          <div className="flex items-baseline gap-2">
            <div className="flex justify-start text-copy">
              <CartLineQuantityAdjust
                lineId={lineId}
                quantity={quantity}
                linesRemove={linesRemove}
              />
            </div>
            <button type="button" onClick={() => linesRemove(lineId)}>
              <span className="sr-only">Remove</span>
              <IconRemove
                viewBox="0 0 15 15"
                className="w-3 h-3"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <Text>
          <CartLinePrice as="span" />
        </Text>
      </div>
    </li>
  );
}

function CartEmpty({onClose}) {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <Heading>Your cart is empty</Heading>
      <Button onClick={onClose}>Continue shopping</Button>
      <div className="flex flex-col text-center">
        <Text>Have an account?</Text>
        <Text>
          <Link
            className="text-orange-600 underline"
            onClick={onClose}
            to="/account/register"
          >
            Join
          </Link>{' '}
          or{' '}
          <Link
            className="text-orange-600 underline"
            onClick={onClose}
            to="/account/login"
          >
            login
          </Link>{' '}
          for smoother checkout.
        </Text>
      </div>
    </div>
  );
}

function CartLineQuantityAdjust({lineId, quantity}) {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center mt-2 overflow-auto rounded">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity
          as="div"
          className="text-center py-[0.125rem] text-primary/90"
        />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}

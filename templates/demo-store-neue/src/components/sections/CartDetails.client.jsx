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

import {Button, Heading, Text} from '~/components/elements';

export function CartDetails() {
  const {lines} = useCart();

  return (
    <form className="grid grid-cols-1 h-screen grid-rows-[1fr_auto]">
      <section
        aria-labelledby="cart-contents"
        className="overflow-auto md:p-8 px-4 py-6"
      >
        <Heading as="h2" size="lead" id="cart-contents">
          Cart
        </Heading>
        <ul className="mt-3">
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
        className="md:py-8 md:px-12 py-6 px-4 border-t"
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
      <div className="md:mt-8 mt-6 flex flex-col">
        <Button to={checkoutUrl} width="auto">
          Continue to Checkout
        </Button>
        {/* TODO: We need to fix the shop pay button here */}
        <CartShopPayButton className="flex items-center justify-center w-full rounded-sm mt-2 bg-[#5a31f4]" />
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

  return (
    <li key={lineId} className="flex md:py-5 py-3">
      <div className="flex-shrink-0">
        <Image
          data={merchandise.image}
          className="object-cover object-center md:w-28 md:h-28 w-24 h-24 rounded border"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 ml-4 sm:ml-6">
        <div className="relative grid gap-1">
          <Heading as="h3" size="copy">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </Heading>
          <div className="flex gap-2">
            {merchandise.selectedOptions.map((option) => (
              <Text key={`${option.name}-${option.value}`} color="subtle">
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-baseline gap-2">
            <Text color="subtle">
              <CartLinePrice as="span" />
            </Text>

            <div className="flex justify-start text-copy">
              <CartLineQuantityAdjust
                lineId={lineId}
                quantity={quantity}
                linesRemove={linesRemove}
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineQuantityAdjust({lineId, quantity, linesRemove}) {
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

      <div className="absolute top-0 right-0">
        <button
          type="button"
          className="inline-flex p-2 -m-2 text-primary/40 hover:text-primary/50"
          onClick={() => linesRemove(lineId)}
        >
          Remove
        </button>
      </div>
    </>
  );
}

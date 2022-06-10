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
    <form className="flex flex-col">
      <section aria-labelledby="cart-heading" className="md:col-span-7">
        <ul>
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
        className="sticky px-4 py-6 md:col-span-5"
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
      <div className="grid items-center justify-center gap-4 mt-6 xl:grid-cols-2">
        <Button to={checkoutUrl} width="auto">
          Continue to Checkout
        </Button>
        <CartShopPayButton className="flex items-center justify-center w-full h-12 rounded" />
      </div>
    </>
  );
}

function OrderSummary() {
  const {estimatedCost} = useCart();
  return (
    <>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium">
            {estimatedCost?.subtotalAmount?.amount ? (
              <Money data={estimatedCost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between pt-4">
          <dt className="flex items-center text-primary/60">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-sm font-medium text-primary/90">-</dd>
        </div>
      </dl>
    </>
  );
}

function CartLineItem() {
  const {linesRemove} = useCart();
  const {id: lineId, quantity, merchandise} = useCartLine();

  return (
    <li key={lineId} className="flex py-5">
      <div className="flex-shrink-0">
        <Image
          data={merchandise.image}
          className="object-cover object-center w-28 h-28 rounded border"
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

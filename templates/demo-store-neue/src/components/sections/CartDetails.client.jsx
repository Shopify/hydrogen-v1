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

import {Button, Heading, IconClose, Text} from '../elements';

export default function CartDetails() {
  const {lines, checkoutUrl, estimatedCost} = useCart();

  return (
    <form className="flex flex-col-reverse gap-8 md:grid md:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="md:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>

        <ul className="border-t border-b divide-y">
          {lines.map((line) => {
            return (
              <CartLineProvider key={line.id} line={line}>
                <CartLineItem />
              </CartLineProvider>
            );
          })}
        </ul>
      </section>

      {/* Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="sticky px-4 py-6 rounded-lg md:my-16 md:top-24 bg-primary/[0.02] sm:p-6 lg:p-8 lg:mt-0 md:col-span-5"
      >
        <h2
          id="summary-heading"
          className="text-lg font-medium text-primary/90"
        >
          Order summary
        </h2>

        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-primary/60">Subtotal</dt>
            <dd className="text-sm font-medium text-primary/90">
              {estimatedCost?.subtotalAmount?.amount ? (
                <Money data={estimatedCost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <dt className="flex items-center text-primary/60">
              <span>Shipping estimate</span>
            </dt>
            <dd className="text-sm font-medium text-primary/90">-</dd>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Text as="dt">Duties estimate</Text>
            <Text as="dd">
              {estimatedCost?.totalDutyAmount?.amount ? (
                <Money data={estimatedCost?.totalDutyAmount} />
              ) : (
                '-'
              )}
            </Text>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Text as="dt">Tax estimate</Text>
            <Text as="dd">
              {estimatedCost?.totalTaxAmount?.amount ? (
                <Money data={estimatedCost?.totalTaxAmount} />
              ) : (
                '-'
              )}
            </Text>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <dt className="text-base font-medium text-primary/90">
              {estimatedCost?.totalAmount?.amount ===
              estimatedCost?.subtotalAmount?.amount
                ? 'Order subtotal'
                : 'Order total'}
            </dt>
            <dd className="text-base font-medium text-primary/90">
              {estimatedCost?.totalAmount?.amount ? (
                <Money data={estimatedCost?.totalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </div>
        </dl>

        <div className="grid items-center justify-center gap-4 mt-6 xl:grid-cols-2">
          <Button to={checkoutUrl} width="auto">
            Continue to Checkout
          </Button>
          <CartShopPayButton className="flex items-center justify-center w-full h-12 rounded" />
        </div>
      </section>
    </form>
  );
}

function CartLineItem({line}) {
  const {linesRemove} = useCart();
  const {id: lineId, quantity, merchandise} = useCartLine();

  return (
    <li key={lineId} className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          data={merchandise.image}
          className="object-cover object-center w-24 h-24 rounded-md sm:w-48 sm:h-48"
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
              <Text color="subtle">
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-baseline gap-2">
            <Text color="subtle">
              <CartLinePrice as="span" />
            </Text>

            <div className="flex justify-start text-copy">
              <label htmlFor={`quantity-${lineId}`} className="sr-only">
                Quantity, {quantity}
              </label>
              <div className="flex items-center mt-2 overflow-auto border rounded border-primary/10">
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
                  <span className="sr-only">Remove</span>
                  <IconClose aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

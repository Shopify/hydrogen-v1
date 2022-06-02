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

/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

// TODO: Replace with our own icons

import {CheckIcon, ClockIcon} from '@heroicons/react/solid';
import {Button, Heading, IconClose, Text} from '../elements';

const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Sienna',
    inStock: true,
    size: 'Large',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Black',
    inStock: false,
    leadTime: '3–4 weeks',
    size: 'Large',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35.00',
    color: 'White',
    inStock: true,
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg',
    imageAlt: 'Insulated bottle with white base and black snap lid.',
  },
];

export default function CartDetails() {
  const {lines, note, checkoutUrl, estimatedCost} = useCart();

  return (
    <form className="flex flex-col-reverse gap-8 md:grid md:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="md:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>

        <ul
          role="list"
          className="border-t border-b border-gray-200 divide-y divide-gray-200"
        >
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
        className="sticky px-4 py-6 rounded-lg md:my-16 md:top-24 bg-gray-50 sm:p-6 lg:p-8 lg:mt-0 md:col-span-5"
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
  const {linesRemove, linesUpdate} = useCart();
  const {id: lineId, quantity, merchandise} = useCartLine();

  const product = {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Sienna',
    inStock: true,
    size: 'Large',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in sienna.",
  };
  return (
    <li key={lineId} className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          data={merchandise.image}
          className="object-cover object-center w-24 h-24 rounded-md sm:w-48 sm:h-48"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 ml-4 sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <Heading as="h3" size="lead">
                <Link to={`/products/${merchandise.product.handle}`}>
                  {merchandise.product.title}
                </Link>
              </Heading>
            </div>
            <div className="flex gap-4 mt-1 opacity-50">
              <Text>{merchandise.selectedOptions[0].value}</Text>
              {merchandise.selectedOptions[1].value ? (
                <>
                  <span className="opacity-30">|</span>
                  <Text>{merchandise.selectedOptions[1].value}</Text>
                </>
              ) : null}
            </div>
            <p className="mt-1 font-medium text-primary/90">
              <CartLinePrice />
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <label htmlFor={`quantity-${lineId}`} className="sr-only">
              Quantity, {quantity}
            </label>
            <div className="flex items-center mt-2 overflow-auto border rounded border-primary/30">
              <CartLineQuantityAdjustButton
                adjust="decrease"
                aria-label="Decrease quantity"
                className="p-2 disabled:pointer-events-all disabled:cursor-wait"
              >
                &#8722;
              </CartLineQuantityAdjustButton>
              <CartLineQuantity
                as="div"
                className="p-2 text-xs text-center text-primary/90"
              />
              <CartLineQuantityAdjustButton
                adjust="increase"
                aria-label="Increase quantity"
                className="p-2 text-primary/40 disabled:pointer-events-all disabled:cursor-wait"
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

        <p className="flex mt-4 space-x-2 text-primary/70">
          {product.inStock ? (
            <CheckIcon
              className="flex-shrink-0 w-5 h-5 text-green-500"
              aria-hidden="true"
            />
          ) : (
            <ClockIcon
              className="flex-shrink-0 w-5 h-5 text-primary/30"
              aria-hidden="true"
            />
          )}

          <span>
            {product.inStock ? 'In stock' : `Ships in ${product.leadTime}`}
          </span>
        </p>
      </div>
    </li>
  );
}

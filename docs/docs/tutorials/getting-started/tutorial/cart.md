# Build a cart


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Previously, you [built a product page](/tutorials/getting-started/tutorial/products/). Your Hydrogen storefront now renders detailed information about products and provides a purchasing option, **Buy it now**, to customers. You're now ready to build a cart in your app.

In this tutorial, you'll build a cart that contains the merchandise that a customer wants to buy, and the estimated cost that's associated with the cart.

## Scenario

You want to build functionality into your Hydrogen storefront so customers can add items to their cart that they want to purchase. When a customer is ready to purchase their items, they can proceed to checkout.

## What you’ll learn

In this tutorial, you’ll learn how to do the following tasks:

- Define the context for interacting with a cart, including keeping track of the cart’s open and closed states
- Build a cart section that renders on any page in your Hydrogen storefront
- Update the product details page to include an **Add to cart** option.

![An implementation of a cart in a Hydrogen storefront](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-cart.png)

## Requirements

You’ve completed [Build a product page](/tutorials/getting-started/tutorial/products/).

## Sample code

If you want to quickly get started, then you can copy and paste the following code from each file into the corresponding files in your Hydrogen app. If the file doesn’t yet exist, then you can create it in your Hydrogen app. This tutorial describes the sample code step by step:

> Note:
> The Drawer sample code includes a `Dialog` component from [@headlessui/react](https://www.npmjs.com/package/@headlessui/react). You must install this package manually. [Learn more](#step-2-create-a-drawer).

```jsx
// /src/App.server.jsx

import renderHydrogen from "@shopify/hydrogen/entry-server";
import {
  Router,
  FileRoutes,
  ShopifyProvider,
  CartProvider,
} from "@shopify/hydrogen";
import { Suspense } from "react";

function App({ routes }) {
  return (
    <Suspense fallback={null}>
      <ShopifyProvider>
          <CartProvider>
            <Router>
              <FileRoutes routes={routes} />
            </Router>
          </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
```

```jsx
// /src/components/Layout.server.jsx

import { Suspense } from "react";
import { useShopQuery, CacheLong, gql, Seo } from "@shopify/hydrogen";

import Header from "./Header.client";

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({ children }) {
  const {
    data: { shop },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
  });

  return (
    <>
      <Suspense>
        <Seo
          type="defaultSeo"
          data={{
            title: shop.name,
            description: shop.description,
          }}
        />
      </Suspense>
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Header shop={shop} />

        <main role="main" id="mainContent" className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
    </>
  );
}

const SHOP_QUERY = gql`
  query layout {
    shop {
      name
      description
    }
  }
`;
```

```javascript?filename: '/src/components/Drawer.client.jsx', title: 'Drawer'
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

/**
 * A Drawer component that opens on user click.
 * @param open - Boolean state. If `true`, then the drawer opens.
 * @param onClose - Function should set the open state.
 * @param children - React children node.
 */
function Drawer({ open, onClose, children }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="max-w-lg transform text-left align-middle shadow-xl transition-all antialiased bg-neutral-50">
                  <header className="sticky top-0 flex items-center justify-between px-4 h-24 sm:px-8 md:px-12">
                    <h2
                      id="cart-contents"
                      className="whitespace-pre-wrap max-w-prose font-bold text-lg"
                    >
                      Cart
                    </h2>
                    <button
                      type="button"
                      className="p-4 -m-4 transition text-primary hover:text-primary/50"
                      onClick={onClose}
                    >
                      <IconClose aria-label="Close panel" />
                    </button>
                  </header>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* Use for associating `aria-labelledby` with the title */
Drawer.Title = Dialog.Title;

export { Drawer };

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}

function IconClose() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className="w-5 h-5"
    >
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}
```

```javascript?filename: '/src/components/Header.client.jsx', title: 'Header'
import { useUrl, Link, useCart } from "@shopify/hydrogen";
import { Drawer, useDrawer } from "./Drawer.client";
import { CartDetails } from "./CartDetails.client";

export default function Header({ shop }) {
  const { pathname } = useUrl();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();

  const isHome = pathname === "/";
  return (
    <>
      <Drawer open={isOpen} onClose={closeDrawer}>
        <div className="grid">
          <Drawer.Title>
            <h2 className="sr-only">Cart Drawer</h2>
          </Drawer.Title>
          <CartDetails onClose={closeDrawer} />
        </div>
      </Drawer>
      <header
        role="banner"
        className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm ${
          isHome ? "bg-black/80 text-white" : "bg-white/80"
        }`}
      >
        <div className="flex gap-12">
          <Link className="font-bold" to="/">
            {shop.name}
          </Link>
        </div>

        <button
          onClick={openDrawer}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconBag />
          <CartBadge dark={isHome} />
        </button>
      </header>
    </>
  );
}

function IconBag() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5"
    >
      <title>Bag</title>
      <path
        fillRule="evenodd"
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
      />
    </svg>
  );
}

function CartBadge({ dark }) {
  const { totalQuantity } = useCart();

  if (totalQuantity < 1) {
    return null;
  }
  return (
    <div
      className={`${
        dark ? "text-black bg-white" : "text-white bg-black"
      } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
    >
      <span>{totalQuantity}</span>
    </div>
  );
}
```

```javascript?filename: '/src/components/CartDetails.client.jsx', title: 'CartDetails'
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
} from "@shopify/hydrogen";

export function CartDetails({ onClose }) {
  const { lines } = useCart();

  if (lines.length === 0) {
    return <CartEmpty onClose={onClose} />;
  }

  return (
    <form className="grid grid-cols-1 grid-rows-[1fr_auto] h-[calc(100vh-6rem)]">
      <section
        aria-labelledby="cart-contents"
        className="px-4 pb-4 overflow-auto transition md:px-12"
      >
        <ul className="grid gap-6 md:gap-10 overflow-y-scroll">
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

export function CartEmpty({ onClose }) {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <button
        onClick={onClose}
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        Continue shopping
      </button>
    </div>
  );
}

function CartCheckoutActions() {
  const { checkoutUrl } = useCart();
  return (
    <>
      <div className="flex flex-col items-center mt-6 md:mt-8">
        <Link
          to={checkoutUrl}
          width="full"
          className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
        >
          Continue to Checkout
        </Link>
        <CartShopPayButton className="flex items-center justify-center rounded-sm mt-2 bg-[#5a31f4] w-full" />
      </div>
    </>
  );
}

function OrderSummary() {
  const { cost } = useCart();
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              "-"
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-green-600">Free and carbon neutral</dd>
        </div>
      </dl>
    </>
  );
}

export function CartLineItem() {
  const { linesRemove } = useCart();
  const { id: lineId, quantity, merchandise } = useCartLine();

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
          <h3 className="font-medium">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </h3>

          <div className="flex flex-col justify-start mt-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <span key={option.name} className="last:mb-4 text-gray-500">
                {option.name}: {option.value}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <div className="flex justify-start text-copy mr-4">
              <CartLineQuantityAdjust
                lineId={lineId}
                quantity={quantity}
                linesRemove={linesRemove}
              />
            </div>
            <button
              type="button"
              onClick={() => linesRemove(lineId)}
              className="h-[40px] w-[40px] border rounded flex justify-center items-center"
            >
              <span className="sr-only">Remove</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="w-[13px] h-[14px]"
              >
                <title>Remove</title>
                <path
                  transform="translate(4 4)"
                  d="M1.0498 0.75C0.917196 0.75 0.790019 0.802679 0.696251 0.896447C0.602483 0.990215 0.549805 1.11739 0.549805 1.25V7.25C0.549805 7.38261 0.602483 7.50979 0.696251 7.60355C0.790019 7.69732 0.917196 7.75 1.0498 7.75C1.18241 7.75 1.30959 7.69732 1.40336 7.60355C1.49713 7.50979 1.5498 7.38261 1.5498 7.25V1.25C1.5498 1.11739 1.49713 0.990215 1.40336 0.896447C1.30959 0.802679 1.18241 0.75 1.0498 0.75ZM3.9498 0.75C3.8172 0.75 3.69002 0.802679 3.59625 0.896447C3.50248 0.990215 3.4498 1.11739 3.4498 1.25V7.25C3.4498 7.38261 3.50248 7.50979 3.59625 7.60355C3.69002 7.69732 3.8172 7.75 3.9498 7.75C4.08241 7.75 4.20959 7.69732 4.30336 7.60355C4.39713 7.50979 4.4498 7.38261 4.4498 7.25V1.25C4.4498 1.11739 4.39713 0.990215 4.30336 0.896447C4.20959 0.802679 4.08241 0.75 3.9498 0.75Z"
                />
                <path d="M12.5 2.5H8.97C8.93489 1.90332 8.72636 1.32986 8.37 0.85C7.94 0.32 7.3 0 6.5 0C5.7 0 5.06 0.32 4.63 0.85C4.27312 1.32958 4.06454 1.9032 4.03 2.5H0.5C0.367392 2.5 0.240215 2.55268 0.146447 2.64645C0.0526784 2.74021 0 2.86739 0 3C0 3.13261 0.0526784 3.25979 0.146447 3.35355C0.240215 3.44732 0.367392 3.5 0.5 3.5H1.75V13.5C1.75 13.78 1.97 14 2.25 14H10.75C10.8826 14 11.0098 13.9473 11.1036 13.8536C11.1973 13.7598 11.25 13.6326 11.25 13.5V3.5H12.5C12.6326 3.5 12.7598 3.44732 12.8536 3.35355C12.9473 3.25979 13 3.13261 13 3C13 2.86739 12.9473 2.74021 12.8536 2.64645C12.7598 2.55268 12.6326 2.5 12.5 2.5ZM5.41 1.48C5.64 1.19 5.99 1 6.5 1C7.01 1 7.35 1.19 7.59 1.48C7.79 1.72 7.89 2.08 7.95 2.5H5.05C5.1 2.08 5.22 1.72 5.41 1.48ZM10.25 13H2.75V3.5H10.25V13Z" />
              </svg>
            </button>
          </div>
        </div>
        <span>
          <CartLinePrice as="span" />
        </span>
      </div>
    </li>
  );
}

function CartLineQuantityAdjust({ lineId, quantity }) {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center overflow-auto border rounded">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="h-[40px] flex justify-center items-center px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity
          as="div"
          className="h-[40px] flex justify-center items-center text-center py-[0.125rem] px-2 text-primary/90"
        />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="h-[40px] flex justify-center items-center px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}
```

```javascript?filename: '/src/components/ProductDetails.client.jsx', title: 'ProductDetails'
import {
  ProductOptionsProvider,
  MediaFile,
  useProductOptions,
  ProductPrice,
  BuyNowButton,
  AddToCartButton,
} from "@shopify/hydrogen";

export default function ProductDetails({ product }) {
  return (
    <ProductOptionsProvider data={product}>
      <section className="w-full overflow-x-hidden gap-4 md:gap-8 grid px-6 md:px-8 lg:px-12">
        <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 md:w-full lg:col-span-2">
            <div className="md:col-span-2 snap-center card-image aspect-square md:w-full w-[80vw] shadow rounded">
              <ProductGallery media={product.media.nodes} />
            </div>
          </div>
          <div className="sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
            <div className="grid gap-2">
              <h1 className="text-4xl font-bold leading-10 whitespace-normal">
                {product.title}
              </h1>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                {product.vendor}
              </span>
            </div>
            <ProductForm product={product} />
            <div className="mt-8">
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </ProductOptionsProvider>
  );
}

function ProductForm({ product }) {
  const { options, selectedVariant } = useProductOptions();

  return (
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({ name, values }) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-wrap items-baseline justify-start gap-6"
              >
                <legend className="whitespace-pre-wrap max-w-prose font-bold text-lead min-w-[4rem]">
                  {name}
                </legend>
                <div className="flex flex-wrap items-baseline gap-4">
                  <OptionRadio name={name} values={values} />
                </div>
              </div>
            );
          })}
        </div>
      }
      <div>
        <ProductPrice
          className="text-gray-500 line-through text-lg font-semibold"
          priceType="compareAt"
          variantId={selectedVariant.id}
          data={product}
        />
        <ProductPrice
          className="text-gray-900 text-lg font-semibold"
          variantId={selectedVariant.id}
          data={product}
        />
      </div>
      <div className="grid items-stretch gap-4">
        <PurchaseMarkup />
      </div>
    </form>
  );
}

function PurchaseMarkup() {
  const { selectedVariant } = useProductOptions();
  const isOutOfStock = !selectedVariant?.availableForSale || false;

  return (
    <>
      <AddToCartButton
        type="button"
        variantId={selectedVariant.id}
        quantity={1}
        accessibleAddingToCartLabel="Adding item to your cart"
        disabled={isOutOfStock}
      >
        <span className="bg-black text-white inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none w-full">
          {isOutOfStock ? "Sold out" : "Add to cart"}
        </span>
      </AddToCartButton>
      {isOutOfStock ? (
        <span className="text-black text-center py-3 px-6 border rounded-sm leading-none ">
          Available in 2-3 weeks
        </span>
      ) : (
        <BuyNowButton variantId={selectedVariant.id}>
          <span className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none border w-full">
            Buy it now
          </span>
        </BuyNowButton>
      )}
    </>
  );
}

function OptionRadio({ values, name }) {
  const { selectedOptions, setSelectedOption } = useProductOptions();

  return (
    <>
      {values.map((value) => {
        const checked = selectedOptions[name] === value;
        const id = `option-${name}-${value}`;

        return (
          <label key={id} htmlFor={id}>
            <input
              className="sr-only"
              type="radio"
              id={id}
              name={`option[${name}]`}
              value={value}
              checked={checked}
              onChange={() => setSelectedOption(name, value)}
            />
            <div
              className={`leading-none border-b-[2px] py-1 cursor-pointer transition-all duration-200 ${
                checked ? "border-gray-500" : "border-neutral-50"
              }`}
            >
              {value}
            </div>
          </label>
        );
      })}
    </>
  );
}

function ProductGallery({ media }) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`grid gap-4 overflow-x-scroll grid-flow-col md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 w-screen md:w-full lg:col-span-2`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === "MODEL_3D") {
          extraProps = {
            interactionPromptThreshold: "0",
            ar: true,
            loading: "eager",
            disableZoom: true,
          };
        }

        const data = {
          ...med,
          image: {
            ...med.image,
            altText: med.alt || "Product image",
          },
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"
            } snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded`}
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover`}
              data={data}
              options={{
                crop: "center",
              }}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}
```



## Step 1: Wrap your app in the `CartProvider`

You can make a cart context available to your entire Hydrogen app by wrapping your app in the `CartProvider` component.

The [`CartProvider`](/components/cart/cartprovider/) component creates a cart object and callbacks that can be accessed by any descendent component using the [`useCart`](/hooks/cart/usecart/) hook and related hooks. `CartProvider` also carries out any callback props when a relevant action is performed.

In `/src/App.server.jsx`, import the `CartProvider` component and make it a descendent of the [`ShopifyProvider`](/components/global/shopifyprovider/) component:

```jsx
// /src/App.server.jsx

import renderHydrogen from "@shopify/hydrogen/entry-server";
import {
  Router,
  FileRoutes,
  ShopifyProvider,
  CartProvider,
} from "@shopify/hydrogen";
import { Suspense } from "react";

function App({ routes }) {
  return (
    <Suspense fallback={null}>
      <ShopifyProvider>
          <CartProvider>
            <Router>
              <FileRoutes routes={routes} />
            </Router>
          </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
```



## Step 2: Create a drawer

You want to display a cart section when a customer clicks the cart icon or adds an item to the cart. To display the cart as an overlay on a page, you can use a [`Dialog` component](https://headlessui.dev/react/dialog) from [@headlessui/react](https://www.npmjs.com/package/@headlessui/react).

1. Stop your development server.

2. Install the [@headlessui/react](https://www.npmjs.com/package/@headlessui/react) package. This package includes unstyled and fully-accessible UI components for React, and integrates well with Tailwind:

```bash?title: 'npm'

npm install -s @headlessui/react
```

```bash?title: 'Yarn'
yarn add @headlessui/react
```



3. Restart your developer server.

4. In your project, create a `Drawer` client component in `/src/components/Drawer.client.jsx` with the following contents:

```jsx
// /src/components/Drawer.client.jsx

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

/**
 * A Drawer component that opens on user click.
 * @param open - Boolean state. If `true`, then the drawer opens.
 * @param onClose - Function should set the open state.
 * @param children - React children node.
 */
function Drawer({ open, onClose, children }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="max-w-lg transform text-left align-middle shadow-xl transition-all antialiased bg-neutral-50">
                  <header className="sticky top-0 flex items-center justify-between px-4 h-24 sm:px-8 md:px-12">
                    <h2
                      id="cart-contents"
                      className="whitespace-pre-wrap max-w-prose font-bold text-lg"
                    >
                      Cart
                    </h2>
                    <button
                      type="button"
                      className="p-4 -m-4 transition text-primary hover:text-primary/50"
                      onClick={onClose}
                    >
                      <IconClose aria-label="Close panel" />
                    </button>
                  </header>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export { Drawer };

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}

function IconClose() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className="w-5 h-5"
    >
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}
```



## Step 3: Add a cart icon to the header

In this step, you'll add a cart icon to the header to trigger a cart drawer. To implement this behavior, you'll need a client-side state.

1. In your project, create a `Header` client component and add the `Drawer` component to it. Then, add a cart button to toggle the drawer along with a bag icon (`IconBag`) and cart badge counter (`CartBadge`).

```jsx
// /src/components/Header.client.jsx

import { useUrl, Link, useCart } from "@shopify/hydrogen";
import { Drawer, useDrawer } from "./Drawer.client";

export default function Header({ shop }) {
  const { pathname } = useUrl();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();

  const isHome = pathname === "/";
  return (
    <>
      <Drawer open={isOpen} onClose={closeDrawer}></Drawer>
      <header
        role="banner"
        className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm ${
          isHome ? "bg-black/80 text-white" : "bg-white/80"
        }`}
      >
        <div className="flex gap-12">
          <Link className="font-bold" to="/">
            {shop.name}
          </Link>
        </div>

        <button
          onClick={openDrawer}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconBag />
          <CartBadge dark={isHome} />
        </button>
      </header>
    </>
  );
}

function IconBag() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5"
    >
      <title>Bag</title>
      <path
        fillRule="evenodd"
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
      />
    </svg>
  );
}

function CartBadge({ dark }) {
  const { totalQuantity } = useCart();

  if (totalQuantity < 1) {
    return null;
  }
  return (
    <div
      className={`${
        dark ? "text-black bg-white" : "text-white bg-black"
      } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
    >
      <span>{totalQuantity}</span>
    </div>
  );
}
```



2. Import the `Header` component into your `Layout` component:

```jsx
// /src/components/Layout.server.jsx

import { Suspense } from "react";
import { useShopQuery, CacheLong, gql, Seo } from "@shopify/hydrogen";

import Header from "./Header.client";

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({ children }) {
  const {
    data: { shop },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
  });

  return (
    <>
      <Suspense>
        <Seo
          type="defaultSeo"
          data={{
            title: shop.name,
            description: shop.description,
          }}
        />
      </Suspense>
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Header shop={shop} />

        <main role="main" id="mainContent" className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
    </>
  );
}

const SHOP_QUERY = gql`
  query layout {
    shop {
      name
      description
    }
  }
`;
```



The cart now renders on any page in your app:

<video autoplay muted loop controls>
  <source src="https://shopify.dev/assets/custom-storefronts/hydrogen/cart-open-close.mp4" />
</video>

## Step 4: Build the cart

In this step, you'll build different UI components within your cart. You'll centrally locate all of the UI components within a new `CartDetails` component.

1. Create a `CartDetails` client component in `/src/components/CartDetails.client.jsx` with the following contents:


    ```jsx
    // /src/components/CartDetails.client.jsx

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
    } from "@shopify/hydrogen";

    export function CartDetails({ onClose }) {
      const { lines } = useCart();

      if (lines.length === 0) {
        return <CartEmpty onClose={onClose} />;
      }

      return (
        <form className="grid grid-cols-1 grid-rows-[1fr_auto] h-[calc(100vh-6rem)]">
          <section
            aria-labelledby="cart-contents"
            className="px-4 pb-4 overflow-auto transition md:px-12"
          >
            <ul className="grid gap-6 md:gap-10 overflow-y-scroll">
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
    ```



2. In `/src/components/CartDetails.client.jsx`, add each of the following functions:

  - [CartEmpty](#cartempty)
  - [CartCheckoutActions](#cartcheckoutactions)
  - [OrderSummary](#ordersummary)
  - [CartLineItem](#cartlineitem)
  - [CartLineQuantityAdjust](#cartlinequantityadjust)

### CartEmpty

Add the `CartEmpty` function to `/src/components/CartDetails.client.jsx` to render the UI when a cart doesn't contain any products:

```jsx
// /src/components/CartDetails.client.jsx

export function CartEmpty({ onClose }) {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <button
        onClick={onClose}
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        Continue shopping
      </button>
    </div>
  );
}
```



![The UI when a cart doesn't contain any products](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-cart-empty.png)

### CartCheckoutActions

Add the `CartCheckoutActions` function to `/src/components/CartDetails.client.jsx` to render checkout and Shop Pay buttons:

```jsx
// /src/components/CartDetails.client.jsx

function CartCheckoutActions() {
  const { checkoutUrl } = useCart();
  return (
    <>
      <div className="flex flex-col items-center mt-6 md:mt-8">
        <Link
          to={checkoutUrl}
          width="full"
          className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
        >
          Continue to Checkout
        </Link>
        <CartShopPayButton className="flex items-center justify-center rounded-sm mt-2 bg-[#5a31f4] w-full" />
      </div>
    </>
  );
}
```



![Checkout and Shop Pay buttons](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-checkout-shop-pay.png)

### OrderSummary

Add the `OrderSummary` function to `/src/components/CartDetails.client.jsx` to render order summary information, which includes a subtotal and a shipping estimate:

```jsx
// /src/components/CartDetails.client.jsx

function OrderSummary() {
  const { cost } = useCart();
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              "-"
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-green-600">Free and carbon neutral</dd>
        </div>
      </dl>
    </>
  );
}
```



![Order summary information](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-order-summary.png)

### CartLineItem

Add the `CartLineItem` function to `/src/components/CartDetails.client.jsx` to render cart line items that include an image, product details, and a price:

```jsx
// /src/components/CartDetails.client.jsx

export function CartLineItem() {
  const { linesRemove } = useCart();
  const { id: lineId, quantity, merchandise } = useCartLine();

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
          <h3 className="font-medium">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </h3>

          <div className="flex flex-col justify-start mt-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <span key={option.name} className="last:mb-4 text-gray-500">
                {option.name}: {option.value}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <div className="flex justify-start text-copy mr-4">
              <CartLineQuantityAdjust
                lineId={lineId}
                quantity={quantity}
                linesRemove={linesRemove}
              />
            </div>
            <button
              type="button"
              onClick={() => linesRemove(lineId)}
              className="h-[40px] w-[40px] border rounded flex justify-center items-center"
            >
              <span className="sr-only">Remove</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="w-[13px] h-[14px]"
              >
                <title>Remove</title>
                <path
                  transform="translate(4 4)"
                  d="M1.0498 0.75C0.917196 0.75 0.790019 0.802679 0.696251 0.896447C0.602483 0.990215 0.549805 1.11739 0.549805 1.25V7.25C0.549805 7.38261 0.602483 7.50979 0.696251 7.60355C0.790019 7.69732 0.917196 7.75 1.0498 7.75C1.18241 7.75 1.30959 7.69732 1.40336 7.60355C1.49713 7.50979 1.5498 7.38261 1.5498 7.25V1.25C1.5498 1.11739 1.49713 0.990215 1.40336 0.896447C1.30959 0.802679 1.18241 0.75 1.0498 0.75ZM3.9498 0.75C3.8172 0.75 3.69002 0.802679 3.59625 0.896447C3.50248 0.990215 3.4498 1.11739 3.4498 1.25V7.25C3.4498 7.38261 3.50248 7.50979 3.59625 7.60355C3.69002 7.69732 3.8172 7.75 3.9498 7.75C4.08241 7.75 4.20959 7.69732 4.30336 7.60355C4.39713 7.50979 4.4498 7.38261 4.4498 7.25V1.25C4.4498 1.11739 4.39713 0.990215 4.30336 0.896447C4.20959 0.802679 4.08241 0.75 3.9498 0.75Z"
                />
                <path d="M12.5 2.5H8.97C8.93489 1.90332 8.72636 1.32986 8.37 0.85C7.94 0.32 7.3 0 6.5 0C5.7 0 5.06 0.32 4.63 0.85C4.27312 1.32958 4.06454 1.9032 4.03 2.5H0.5C0.367392 2.5 0.240215 2.55268 0.146447 2.64645C0.0526784 2.74021 0 2.86739 0 3C0 3.13261 0.0526784 3.25979 0.146447 3.35355C0.240215 3.44732 0.367392 3.5 0.5 3.5H1.75V13.5C1.75 13.78 1.97 14 2.25 14H10.75C10.8826 14 11.0098 13.9473 11.1036 13.8536C11.1973 13.7598 11.25 13.6326 11.25 13.5V3.5H12.5C12.6326 3.5 12.7598 3.44732 12.8536 3.35355C12.9473 3.25979 13 3.13261 13 3C13 2.86739 12.9473 2.74021 12.8536 2.64645C12.7598 2.55268 12.6326 2.5 12.5 2.5ZM5.41 1.48C5.64 1.19 5.99 1 6.5 1C7.01 1 7.35 1.19 7.59 1.48C7.79 1.72 7.89 2.08 7.95 2.5H5.05C5.1 2.08 5.22 1.72 5.41 1.48ZM10.25 13H2.75V3.5H10.25V13Z" />
              </svg>
            </button>
          </div>
        </div>
        <span>
          <CartLinePrice as="span" />
        </span>
      </div>
    </li>
  );
}
```



![Cart line items that include an image, product details, and a price](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-cart-line-items.png)

### CartLineQuantityAdjust

Add the `CartLineQuantityAdjust` function to `/src/components/CartDetails.client.jsx` to render the quantity of each cart line item and a plus `+` and minus `-` adjustor function:

```jsx
// /src/components/CartDetails.client.jsx

function CartLineQuantityAdjust({ lineId, quantity }) {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center overflow-auto border rounded">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="h-[40px] flex justify-center items-center px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity
          as="div"
          className="h-[40px] flex justify-center items-center text-center py-[0.125rem] px-2 text-primary/90"
        />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="h-[40px] flex justify-center items-center px-3 py-[0.125rem] transition text-primary/40 hover:text-primary disabled:pointer-events-all disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}
```



![The quantity of each cart line item](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-cart-line-item-quantities.png)

## Step 5: Add `CartDetails` to `Drawer`

After you’ve finished building the different sections of your `CartDetails` component, you’re ready to render the cart in your app.

In your `Header` component, add the `CartDetails` component to the `Drawer` component:

```jsx
// /src/components/Header.client.jsx

import { useUrl, Link, useCart } from "@shopify/hydrogen";
import { Drawer, useDrawer } from "./Drawer.client";
import { CartDetails } from "./CartDetails.client";

export default function Header({ shop }) {
  const { pathname } = useUrl();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();

  const isHome = pathname === "/";
  return (
    <>
      <Drawer open={isOpen} onClose={closeDrawer}>
        <div className="grid">
          <Drawer.Title>
            <h2 className="sr-only">Cart Drawer</h2>
          </Drawer.Title>
          <CartDetails onClose={closeDrawer} />
        </div>
      </Drawer>
      <header
        role="banner"
        className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm ${
          isHome ? "bg-black/80 text-white" : "bg-white/80"
        }`}
      >
        <div className="flex gap-12">
          <Link className="font-bold" to="/">
            {shop.name}
          </Link>
        </div>

        <button
          onClick={openDrawer}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconBag />
          <CartBadge dark={isHome} />
        </button>
      </header>
    </>
  );
}

function IconBag() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5"
    >
      <title>Bag</title>
      <path
        fillRule="evenodd"
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
      />
    </svg>
  );
}

function CartBadge({ dark }) {
  const { totalQuantity } = useCart();

  if (totalQuantity < 1) {
    return null;
  }
  return (
    <div
      className={`${
        dark ? "text-black bg-white" : "text-white bg-black"
      } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
    >
      <span>{totalQuantity}</span>
    </div>
  );
}
```



## Step 6: Add an "Add to cart" button to the product page

Now that you’ve built a cart context with a functioning cart, you can update the product details page to offer an **Add to cart** button.

Replace the `BuyNowButton` logic with a `PurchaseMarkup` component and add an **Add to cart** button:

```jsx
// /src/components/ProductDetails.client.jsx

import {
  ProductOptionsProvider,
  MediaFile,
  useProductOptions,
  ProductPrice,
  BuyNowButton,
  AddToCartButton,
} from "@shopify/hydrogen";

export default function ProductDetails({ product }) {
  return (
    <ProductOptionsProvider data={product}>
      <section className="w-full overflow-x-hidden gap-4 md:gap-8 grid px-6 md:px-8 lg:px-12">
        <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 md:w-full lg:col-span-2">
            <div className="md:col-span-2 snap-center card-image aspect-square md:w-full w-[80vw] shadow rounded">
              <ProductGallery media={product.media.nodes} />
            </div>
          </div>
          <div className="sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
            <div className="grid gap-2">
              <h1 className="text-4xl font-bold leading-10 whitespace-normal">
                {product.title}
              </h1>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                {product.vendor}
              </span>
            </div>
            <ProductForm product={product} />
            <div className="mt-8">
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </ProductOptionsProvider>
  );
}

function ProductForm({ product }) {
  const { options, selectedVariant } = useProductOptions();

  return (
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({ name, values }) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-wrap items-baseline justify-start gap-6"
              >
                <legend className="whitespace-pre-wrap max-w-prose font-bold text-lead min-w-[4rem]">
                  {name}
                </legend>
                <div className="flex flex-wrap items-baseline gap-4">
                  <OptionRadio name={name} values={values} />
                </div>
              </div>
            );
          })}
        </div>
      }
      <div>
        <ProductPrice
          className="text-gray-500 line-through text-lg font-semibold"
          priceType="compareAt"
          variantId={selectedVariant.id}
          data={product}
        />
        <ProductPrice
          className="text-gray-900 text-lg font-semibold"
          variantId={selectedVariant.id}
          data={product}
        />
      </div>
      <div className="grid items-stretch gap-4">
        <PurchaseMarkup />
      </div>
    </form>
  );
}

function PurchaseMarkup() {
  const { selectedVariant } = useProductOptions();
  const isOutOfStock = !selectedVariant?.availableForSale || false;

  return (
    <>
      <AddToCartButton
        type="button"
        variantId={selectedVariant.id}
        quantity={1}
        accessibleAddingToCartLabel="Adding item to your cart"
        disabled={isOutOfStock}
      >
        <span className="bg-black text-white inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none w-full">
          {isOutOfStock ? "Sold out" : "Add to cart"}
        </span>
      </AddToCartButton>
      {isOutOfStock ? (
        <span className="text-black text-center py-3 px-6 border rounded-sm leading-none ">
          Available in 2-3 weeks
        </span>
      ) : (
        <BuyNowButton variantId={selectedVariant.id}>
          <span className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none border w-full">
            Buy it now
          </span>
        </BuyNowButton>
      )}
    </>
  );
}

function OptionRadio({ values, name }) {
  const { selectedOptions, setSelectedOption } = useProductOptions();

  return (
    <>
      {values.map((value) => {
        const checked = selectedOptions[name] === value;
        const id = `option-${name}-${value}`;

        return (
          <label key={id} htmlFor={id}>
            <input
              className="sr-only"
              type="radio"
              id={id}
              name={`option[${name}]`}
              value={value}
              checked={checked}
              onChange={() => setSelectedOption(name, value)}
            />
            <div
              className={`leading-none border-b-[2px] py-1 cursor-pointer transition-all duration-200 ${
                checked ? "border-gray-500" : "border-neutral-50"
              }`}
            >
              {value}
            </div>
          </label>
        );
      })}
    </>
  );
}

function ProductGallery({ media }) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`grid gap-4 overflow-x-scroll grid-flow-col md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 w-screen md:w-full lg:col-span-2`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === "MODEL_3D") {
          extraProps = {
            interactionPromptThreshold: "0",
            ar: true,
            loading: "eager",
            disableZoom: true,
          };
        }

        const data = {
          ...med,
          image: {
            ...med.image,
            altText: med.alt || "Product image",
          },
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"
            } snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded`}
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover`}
              data={data}
              options={{
                crop: "center",
              }}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}
```



The product details page now includes an **Add to cart** button:

![A product details page with the add to cart button](https://shopify.dev/assets/custom-storefronts/hydrogen/product-details-add-to-cart.png)

If you add a product to your cart, and click the cart icon, then the product displays in the cart section:

![A product that has been added to a cart](https://shopify.dev/assets/custom-storefronts/hydrogen/add-product-to-cart.png)

## Next steps

- Explore the source code of the [example Hydrogen demo store](https://github.com/Shopify/hydrogen/tree/main/templates/demo-store) in GitHub.
- Get familiar with [React Server Components](/tutorials/react-server-components/).
- Learn more about the [Shopify-specific commerce components, hooks, and utilities](https://shopify.dev/docs/api/hydrogen) included in Hydrogen.
- Build your own API using [API routes](/tutorials/routing/index.md#api-routes).

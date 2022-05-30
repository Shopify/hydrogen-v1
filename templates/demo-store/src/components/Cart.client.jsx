import {
  useCart,
  CartCheckoutButton,
  Link,
  CartLines,
  CartLineImage,
  CartLineProductTitle,
  CartLineQuantityAdjustButton,
  CartLinePrice,
  CartLineQuantity,
  CartShopPayButton,
  CartEstimatedCost,
  useCartLine,
} from '@shopify/hydrogen';
import {Dialog} from '@headlessui/react';

import {useCartUI} from './CartUIProvider.client';
import CartIconWithItems from './CartIconWithItems.client';
import {BUTTON_PRIMARY_CLASSES} from './Button.client';

/**
 * A client component that contains the merchandise that a customer intends to purchase, and the estimated cost associated with the cart
 */
export default function Cart() {
  const {isCartOpen, closeCart} = useCartUI();
  const {totalQuantity} = useCart();

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={`z-20 fixed top-0 bottom-0 left-0 right-0 bg-black transition-opacity duration-400 ${
          isCartOpen ? 'opacity-20' : 'opacity-0 pointer-events-none'
        }`}
        onClick={isCartOpen ? closeCart : null}
      />
      <Dialog open={isCartOpen} onClose={closeCart}>
        <Dialog.Overlay className="fixed z-20 inset-0 bg-gray-50 opacity-75" />
        <div
          className={`absolute flex flex-col md:block z-20 top-0 left-0 right-0 bottom-0 md:top-7 h-full md:left-auto md:right-7 md:bottom-auto md:h-auto md:max-h-[calc(100vh-56px)] bg-gray-50 w-full md:w-[470px] rounded-b-lg shadow-2xl ${
            totalQuantity === 0 ? 'overflow-hidden' : 'overflow-y-scroll'
          }`}
        >
          <CartHeader />
          {totalQuantity === 0 ? (
            <CartEmpty />
          ) : (
            <>
              <CartItems />
              <CartFooter />
            </>
          )}
        </div>
      </Dialog>
    </>
  );
}

function CartHeader() {
  const {closeCart} = useCartUI();
  return (
    <header className="border-b border-gray-300 bg-white py-3 px-6 flex justify-between items-center sticky top-0">
      <button type="button" onClick={closeCart}>
        <ArrowIcon />
        <span className="sr-only">Close cart</span>
      </button>
      <span className="text-xs text-gray-500">
        Free shipping on orders over $50
      </span>
      <CartIconWithItems />
    </header>
  );
}

function CartItems() {
  return (
    <div className="px-7 flex-grow" role="table" aria-label="Shopping cart">
      <div role="row" className="sr-only">
        <div role="columnheader">Product image</div>
        <div role="columnheader">Product details</div>
        <div role="columnheader">Price</div>
      </div>
      <CartLines>
        <LineInCart />
      </CartLines>
    </div>
  );
}

function LineInCart() {
  const {merchandise} = useCartLine();
  return (
    <div
      role="row"
      className="flex py-7 border-b last:border-b-0 border-gray-300 text-gray-900"
    >
      <div role="cell" className="flex-shrink-0 mr-7">
        <Link to={`/products/${merchandise.product.handle}`}>
          <CartLineImage
            className="bg-white border border-black border-opacity-5 rounded-xl "
            loaderOptions={{width: 98, height: 98, crop: 'center'}}
          />
        </Link>
      </div>
      <div
        role="cell"
        className="flex flex-col w-full justify-between items-start flex-grow-1 mr-4"
      >
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="hover:underline"
        >
          <CartLineProductTitle className="text-lg font-medium" />
        </Link>
        <ul className="text-xs space-y-1">
          {merchandise.selectedOptions.map(({name, value}) => (
            <li key={name}>
              {name}: {value}
            </li>
          ))}
        </ul>
        <CartItemQuantity />
      </div>
      <div role="cell" className="flex flex-col justify-between items-end">
        <CartLineQuantityAdjustButton
          adjust="remove"
          aria-label="Remove from cart"
          className="disabled:pointer-events-all disabled:cursor-wait"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </CartLineQuantityAdjustButton>
        <CartLinePrice className="text-lg" />
      </div>
    </div>
  );
}

function CartItemQuantity() {
  return (
    <div className="flex border rounded border-gray-300 items-center overflow-auto mt-2">
      <CartLineQuantityAdjustButton
        adjust="decrease"
        aria-label="Decrease quantity"
        className="p-2 disabled:pointer-events-all disabled:cursor-wait"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </CartLineQuantityAdjustButton>
      <CartLineQuantity
        as="div"
        className="p-2 text-gray-900 text-xs text-center"
      />
      <CartLineQuantityAdjustButton
        adjust="increase"
        aria-label="Increase quantity"
        className="p-2 text-gray-400 disabled:pointer-events-all disabled:cursor-wait"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </CartLineQuantityAdjustButton>
    </div>
  );
}

function CartFooter() {
  return (
    <footer className="bottom-0 sticky pb-8 border-t border-black border-opacity-5">
      <div className="relative h-60 bg-white text-gray-900 p-7">
        <div role="table" aria-label="Cost summary">
          <div role="row" className="flex justify-between">
            <span className="font-semibold" role="rowheader">
              Subtotal
            </span>
            <CartEstimatedCost
              amountType="subtotal"
              role="cell"
              className="text-right "
            />
          </div>
          <div role="row" className="flex justify-between mt-2">
            <span className="font-semibold" role="rowheader">
              Shipping
            </span>
            <span role="cell" className="uppercase">
              Free
            </span>
          </div>
        </div>
        <CartShopPayButton className="flex my-4 justify-center w-full bg-[#5a31f4] py-2 rounded-md" />
        <CartCheckoutButton className={BUTTON_PRIMARY_CLASSES}>
          Checkout
        </CartCheckoutButton>
      </div>
    </footer>
  );
}

function CartEmpty() {
  const {closeCart} = useCartUI();
  return (
    <div className="p-7 flex flex-col">
      <p className="mb-4 text-lg text-gray-500 text-center">
        Your cart is empty
      </p>
      <button
        type="button"
        onClick={closeCart}
        className={BUTTON_PRIMARY_CLASSES}
      >
        Continue Shopping
      </button>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="17"
      viewBox="0 0 20 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1.5L19 8.5M19 8.5L12 15.5M19 8.5L1 8.5"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

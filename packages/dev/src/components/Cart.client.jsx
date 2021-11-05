import {
  useCartLinesTotalQuantity,
  CartCheckoutButton,
  Link,
  CartLines,
  CartLine,
  CartShopPayButton,
  CartEstimatedCost,
} from '@shopify/hydrogen/client';
import {Dialog} from '@headlessui/react';

import {useCartUI} from './CartUIProvider.client';
import CartIconWithItems from './CartIconWithItems.client';
import Button, {BUTTON_PRIMARY_CLASSES} from './Button.client';

export default function Cart() {
  const {isCartOpen, closeCart} = useCartUI();
  const itemCount = useCartLinesTotalQuantity();

  return (
    <Dialog open={isCartOpen} onClose={closeCart}>
      <Dialog.Overlay className="fixed z-20 inset-0 bg-black opacity-75" />
      <div
        className={`absolute flex flex-col md:block z-20 top-0 left-0 right-0 bottom-0 md:top-7 h-full md:left-auto md:right-7 md:bottom-auto md:h-auto md:max-h-[calc(100vh-56px)] bg-white w-full md:w-[470px] ${
          itemCount === 0 ? 'overflow-hidden' : 'overflow-y-scroll'
        }`}
      >
        <CartHeader />
        {itemCount === 0 ? (
          <CartEmpty />
        ) : (
          <>
            <CartItems />
            <CartFooter />
          </>
        )}
      </div>
    </Dialog>
  );
}

function CartHeader() {
  const {closeCart} = useCartUI();
  return (
    <header className="border-b-2 border-black py-3 px-6 flex justify-between items-center bg-white sticky top-0">
      <button type="button" onClick={closeCart}>
        <ArrowIcon />
      </button>
      <span className="text-xs">Free shipping on orders over $50</span>
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
        {({merchandise}) => (
          <div
            role="row"
            className="flex py-7 border-b-2 last:border-b-0 border-black"
          >
            <div role="cell" className="flex-shrink-0 mr-7">
              <Link to={`products/${merchandise.product.handle}`}>
                <CartLine.Image
                  className="bg-white border-2 border-black"
                  options={{width: 98, height: 98, crop: 'center'}}
                />
              </Link>
            </div>
            <div
              role="cell"
              className="flex flex-col w-full justify-between items-start flex-grow-1 mr-4"
            >
              <Link
                to={`products/${merchandise.product.handle}`}
                className="hover:underline"
              >
                <CartLine.ProductTitle className="text-lg font-medium" />
              </Link>
              <CartLine.SelectedOptions as="ul" className="text-xs space-y-1">
                {({name, value}) => (
                  <>
                    {name}: {value}
                  </>
                )}
              </CartLine.SelectedOptions>
              <CartLine.Attributes as="ul" className="text-sm space-y-1">
                {({key, value}) => (
                  <>
                    {key}: {value}
                  </>
                )}
              </CartLine.Attributes>
              <CartItemQuantity />
            </div>
            <div
              role="cell"
              className="flex flex-col justify-between items-end"
            >
              <CartLine.QuantityAdjustButton
                adjust="remove"
                aria-label="Remove from cart"
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
              </CartLine.QuantityAdjustButton>
              <CartLine.Price className="text-lg" />
            </div>
          </div>
        )}
      </CartLines>
    </div>
  );
}

function CartItemQuantity() {
  return (
    <div className="flex border border-gray-300 items-center overflow-auto mt-2">
      <CartLine.QuantityAdjustButton
        adjust="decrease"
        className="p-2"
        aria-label="Decrease quantity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </CartLine.QuantityAdjustButton>
      <CartLine.Quantity
        as="div"
        className="p-2 text-gray-900 text-xs text-center"
      />
      <CartLine.QuantityAdjustButton
        adjust="increase"
        className="p-2"
        aria-label="Increase quantity"
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
      </CartLine.QuantityAdjustButton>
    </div>
  );
}

function CartFooter() {
  return (
    <footer className="bottom-0 sticky">
      <div className="relative h-60 bg-white p-7 border-t-2 border-black">
        <div role="table" aria-label="Cost summary">
          <div role="row" className="flex justify-between font-medium text-lg">
            <span role="rowheader">Subtotal</span>
            <CartEstimatedCost
              amountType="subtotal"
              role="cell"
              className="text-right"
            />
          </div>
          <div role="row" className="flex justify-between text-xs mt-2">
            <span role="rowheader">Shipping</span>
            <span role="cell" className="uppercase">
              Free
            </span>
          </div>
        </div>
        <CartShopPayButton
          className={`${BUTTON_PRIMARY_CLASSES} flex py-1 mt-6 mb-2 justify-center bg-[#5a31f4] hover:bg-[#5a31f4]`}
        />
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
      <p className="mb-4 text-lg">Your cart is empty</p>
      <Button handleClick={closeCart} label="Continue Shopping" />
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

import React, {ReactNode, useEffect, useState} from 'react';
import {useCart} from '../CartProvider/index.js';

type PropsWeControl = 'onClick';

/**
 * The `CartCheckoutButton` component renders a button that redirects to the checkout URL for the cart.
 * It must be a descendent of a `CartProvider` component.
 */
export function CartCheckoutButton(
  props: Omit<JSX.IntrinsicElements['button'], PropsWeControl> & {
    /** A `ReactNode` element. */
    children: ReactNode;
  }
) {
  const [requestedCheckout, setRequestedCheckout] = useState(false);
  const {status, checkoutUrl} = useCart();
  const {children, ...passthroughProps} = props;

  useEffect(() => {
    if (requestedCheckout && checkoutUrl && status === 'idle') {
      window.location.href = checkoutUrl;
    }
  }, [requestedCheckout, status, checkoutUrl]);

  return (
    <button
      {...passthroughProps}
      disabled={requestedCheckout || passthroughProps.disabled}
      onClick={() => setRequestedCheckout(true)}
    >
      {children}
    </button>
  );
}

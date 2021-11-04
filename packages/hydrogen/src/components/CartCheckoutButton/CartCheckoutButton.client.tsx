import React, {ReactNode, useEffect, useState} from 'react';
import {useCart, useCartCheckoutUrl} from '../CartProvider';
import {Props} from '../types';

type PropsWeControl = 'onClick';

/**
 * The `CartCheckoutButton` component renders a button that redirects to the checkout URL for the cart.
 * It must be a descendent of a `CartProvider` component.
 */
export function CartCheckoutButton<TTag extends React.ElementType = 'a'>(
  props: Props<TTag, PropsWeControl> & {
    /** A `ReactNode` element. */
    children: ReactNode;
  }
) {
  const [requestedCheckout, setRequestedCheckout] = useState(false);
  const {status} = useCart();
  const url = useCartCheckoutUrl();
  const {children, ...passthroughProps} = props;

  useEffect(() => {
    if (requestedCheckout && url && status === 'idle') {
      window.location.href = url;
    }
  }, [requestedCheckout, status, url]);

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

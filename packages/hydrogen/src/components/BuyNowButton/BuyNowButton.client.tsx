import React, {useEffect, useState, useCallback, MouseEvent} from 'react';
import type {ReactNode} from 'react';
import {useInstantCheckout} from '../CartProvider';

interface BuyNowButtonProps {
  /** The item quantity. Defaults to 1. */
  quantity?: number;
  /** The ID of the variant. */
  variantId: string;
  /** A click event handler. Default behaviour triggers unless prevented */
  onClick?: (event?: MouseEvent) => void | boolean;
  /** An array of cart line attributes that belong to the item being added to the cart. */
  attributes?: {
    key: string;
    value: string;
  }[];
  /** Any `ReactNode` elements. */
  children: ReactNode;
}

type PropsWeControl = 'onClick';

/** The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout. */
export function BuyNowButton(
  props: Omit<JSX.IntrinsicElements['button'], PropsWeControl> &
    BuyNowButtonProps
) {
  const {createInstantCheckout, checkoutUrl} = useInstantCheckout();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    quantity,
    variantId,
    onClick,
    attributes,
    children,
    ...passthroughProps
  } = props;

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const handleBuyNow = useCallback(
    (event?: MouseEvent) => {
      if (onClick) {
        console.log('before it happens');
        const clickShouldContinue = onClick(event);
        console.log('here');
        console.log({clickShouldContinue, default: event?.defaultPrevented});
        if (clickShouldContinue === false || event?.defaultPrevented) return;
      }
      setLoading(true);
      createInstantCheckout({
        lines: [
          {
            quantity: quantity ?? 1,
            merchandiseId: variantId,
            attributes,
          },
        ],
      });
    },
    [onClick, createInstantCheckout, quantity, variantId, attributes]
  );

  return (
    <button
      disabled={loading ?? passthroughProps.disabled}
      {...passthroughProps}
      onClick={handleBuyNow}
    >
      {children}
    </button>
  );
}

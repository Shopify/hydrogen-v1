import React, {useEffect, useState, useCallback} from 'react';
import type {ReactNode} from 'react';
import {useInstantCheckout} from '../CartProvider';

interface BuyNowButtonProps {
  /** The item quantity. Defaults to 1. */
  quantity?: number;
  /** The ID of the variant. */
  variantId: string;
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

  const {quantity, variantId, attributes, children, ...passthroughProps} =
    props;

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const handleBuyNow = useCallback(() => {
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
  }, [setLoading, createInstantCheckout, quantity, variantId, attributes]);

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

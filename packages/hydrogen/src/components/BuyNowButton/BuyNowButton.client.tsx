import React, {useEffect, useState, useCallback, MouseEvent} from 'react';
import {useInstantCheckout} from '../CartProvider';
import {BaseButton, BaseButtonProps} from '../BaseButton';

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
}

/** The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout. */
export function BuyNowButton(props: BuyNowButtonProps & BaseButtonProps) {
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
        const clickShouldContinue = onClick(event);
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
    <BaseButton
      disabled={loading ?? passthroughProps.disabled}
      {...passthroughProps}
      onClick={onClick}
      defaultOnClick={handleBuyNow}
    >
      {children}
    </BaseButton>
  );
}

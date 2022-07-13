import React, {useEffect, useState, useCallback} from 'react';
import {useInstantCheckout} from '../CartProvider';
import {BaseButton, BaseButtonProps} from '../BaseButton';

interface BuyNowButtonProps<AsType extends React.ElementType> {
  /** Provide a React element or component to render as the underlying button. Note: for accessibility compliance, almost always you should use a `button` element, or a component that renders an underlying button. */
  as?: AsType;
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
export function BuyNowButton<AsType extends React.ElementType = 'button'>(
  props: BuyNowButtonProps<AsType> & BaseButtonProps<AsType>
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
  }, [createInstantCheckout, quantity, variantId, attributes]);

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

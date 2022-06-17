import React, { useEffect, useState, useCallback } from 'react';
import { useInstantCheckout } from '../CartProvider';
import { BaseButton } from '../BaseButton';
/** The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout. */
export function BuyNowButton(props) {
    const { createInstantCheckout, checkoutUrl } = useInstantCheckout();
    const [loading, setLoading] = useState(false);
    const { quantity, variantId, onClick, attributes, children, ...passthroughProps } = props;
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
    return (React.createElement(BaseButton, { disabled: loading ?? passthroughProps.disabled, ...passthroughProps, onClick: onClick, defaultOnClick: handleBuyNow }, children));
}

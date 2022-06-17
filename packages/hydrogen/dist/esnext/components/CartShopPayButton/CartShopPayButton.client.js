import React, { useMemo } from 'react';
import { useCart } from '../CartProvider';
import { ShopPayButton } from '../ShopPayButton';
/**
 * The `CartShopPayButton` component renders a `ShopPayButton` for the items in the cart.
 * It must be a descendent of a `CartProvider` component.
 */
export function CartShopPayButton(props) {
    const { lines } = useCart();
    const idsAndQuantities = useMemo(() => {
        return lines.map((line) => ({
            id: line.merchandise.id,
            quantity: line.quantity,
        }));
    }, [lines]);
    return (React.createElement(ShopPayButton, { variantIdsAndQuantities: idsAndQuantities, ...props }));
}

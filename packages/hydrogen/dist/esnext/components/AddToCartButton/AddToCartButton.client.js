import React, { useCallback, useEffect, useState } from 'react';
import { useCart } from '../CartProvider';
import { useProductOptions } from '../ProductOptionsProvider';
import { BaseButton } from '../BaseButton';
/**
 * The `AddToCartButton` component renders a button that adds an item to the cart when pressed.
 * It must be a descendent of the `CartProvider` component.
 */
export function AddToCartButton(props) {
    const [addingItem, setAddingItem] = useState(false);
    const { variantId: explicitVariantId, quantity = 1, attributes, onClick, children, accessibleAddingToCartLabel, ...passthroughProps } = props;
    const { status, linesAdd } = useCart();
    const { selectedVariant } = useProductOptions();
    const variantId = explicitVariantId ?? selectedVariant?.id ?? '';
    const disabled = explicitVariantId === null ||
        variantId === '' ||
        selectedVariant === null ||
        addingItem ||
        passthroughProps.disabled;
    useEffect(() => {
        if (addingItem && status === 'idle') {
            setAddingItem(false);
        }
    }, [status, addingItem]);
    const handleAddItem = useCallback(() => {
        setAddingItem(true);
        linesAdd([
            {
                quantity,
                merchandiseId: variantId,
                attributes,
            },
        ]);
    }, [linesAdd, quantity, variantId, attributes]);
    return (React.createElement(React.Fragment, null,
        React.createElement(BaseButton, { ...passthroughProps, disabled: disabled, onClick: onClick, defaultOnClick: handleAddItem }, children),
        accessibleAddingToCartLabel ? (React.createElement("p", { style: {
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0',
            }, role: "alert", "aria-live": "assertive" }, addingItem ? accessibleAddingToCartLabel : null)) : null));
}

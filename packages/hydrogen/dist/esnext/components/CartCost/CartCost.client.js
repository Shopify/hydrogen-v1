import React from 'react';
import { useCart } from '../CartProvider';
import { Money } from '../Money';
/**
 * The `CartCost` component renders a `Money` component with the
 * cost associated with the `amountType` prop. If no `amountType` prop is specified, then it defaults to `totalAmount`.
 * If `children` is a function, then it will pass down the render props provided by the parent component.
 */
export function CartCost(props) {
    const { cost } = useCart();
    const { amountType = 'total', children, ...passthroughProps } = props;
    let amount;
    if (amountType == 'total') {
        amount = cost?.totalAmount;
    }
    else if (amountType == 'subtotal') {
        amount = cost?.subtotalAmount;
    }
    else if (amountType == 'tax') {
        amount = cost?.totalTaxAmount;
    }
    else if (amountType == 'duty') {
        amount = cost?.totalDutyAmount;
    }
    if (amount == null) {
        return null;
    }
    return (React.createElement(Money, { ...passthroughProps, data: amount }, children));
}

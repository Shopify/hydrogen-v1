import React from 'react';
import {useCart} from '../CartProvider';
import {Money} from '../Money';

export interface CartEstimatedCostProps {
  /** A string type that defines the type of cost needed. Valid values: `total`, `subtotal`, `tax`, or `duty`. */
  amountType?: 'total' | 'subtotal' | 'tax' | 'duty';
  /** A function that takes an object return by the `useMoney` hook and returns a `ReactNode`. */
  children?: React.ReactNode;
}

/**
 * The `CartEstimatedCost` component renders a `Money` component with the
 * cost associated with the `amountType` prop. If no `amountType` prop is specified, then it defaults to `totalAmount`.
 * If `children` is a function, then it will pass down the render props provided by the parent component.
 */
export function CartEstimatedCost<TTag extends keyof JSX.IntrinsicElements>(
  props: Omit<React.ComponentProps<typeof Money>, 'data'> &
    CartEstimatedCostProps
) {
  const {estimatedCost} = useCart();
  const {amountType = 'total', children, ...passthroughProps} = props;
  let amount;

  if (amountType == 'total') {
    amount = estimatedCost?.totalAmount;
  } else if (amountType == 'subtotal') {
    amount = estimatedCost?.subtotalAmount;
  } else if (amountType == 'tax') {
    amount = estimatedCost?.totalTaxAmount;
  } else if (amountType == 'duty') {
    amount = estimatedCost?.totalDutyAmount;
  }

  if (amount == null) {
    return null;
  }

  return (
    <Money<TTag> {...passthroughProps} data={amount}>
      {children}
    </Money>
  );
}

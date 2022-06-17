import React from 'react';
import { Money } from '../Money';
interface CartLinePriceProps {
    /** The type of price. Valid values:`regular` (default) or `compareAt`. */
    priceType?: 'regular' | 'compareAt';
}
/**
 * The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
 * compare at price. It must be a descendent of a `CartLineProvider` component.
 */
export declare function CartLinePrice(props: Omit<React.ComponentProps<typeof Money>, 'data'> & CartLinePriceProps): JSX.Element | null;
export {};

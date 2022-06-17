import { ReactNode } from 'react';
declare type PropsWeControl = 'onClick';
/**
 * The `CartCheckoutButton` component renders a button that redirects to the checkout URL for the cart.
 * It must be a descendent of a `CartProvider` component.
 */
export declare function CartCheckoutButton(props: Omit<JSX.IntrinsicElements['button'], PropsWeControl> & {
    /** A `ReactNode` element. */
    children: ReactNode;
}): JSX.Element;
export {};

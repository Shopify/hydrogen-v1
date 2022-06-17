import { ElementType } from 'react';
import { Props } from '../types';
import { BaseButtonProps } from '../BaseButton';
declare type PropsWeControl = 'adjust';
/**
 * The `CartLineQuantityAdjustButton` component renders a button that adjusts the cart line's quantity when pressed.
 * It must be a descendent of a `CartLineProvider` component.
 */
export declare function CartLineQuantityAdjustButton<TTag extends ElementType = 'button'>(props: Props<TTag, PropsWeControl> & {
    /** The adjustment for a cart line's quantity. Valid values: `increase` (default), `decrease`, or `remove`. */
    adjust?: 'increase' | 'decrease' | 'remove';
} & BaseButtonProps): JSX.Element;
export {};

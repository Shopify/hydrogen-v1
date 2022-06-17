import { type ShopifyImageProps } from '../Image';
import type { Simplify } from 'type-fest';
declare type PropsWeControl = 'data';
/**
 * The `CartLineImage` component renders an `Image` component for the cart line merchandise's image.
 * It must be a descendent of a `CartLineProvider` component.
 */
export declare function CartLineImage(props: Simplify<Omit<ShopifyImageProps, PropsWeControl>>): JSX.Element | null;
export {};

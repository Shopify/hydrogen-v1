import { BaseButtonProps } from '../BaseButton';
interface AddToCartButtonProps {
    /** An array of cart line attributes that belong to the item being added to the cart. */
    attributes?: {
        key: string;
        value: string;
    }[];
    /** The ID of the variant. */
    variantId?: string | null;
    /** The item quantity. */
    quantity?: number;
    /** The text that is announced by the screen reader when the item is being added to the cart. Used for accessibility purposes only and not displayed on the page. */
    accessibleAddingToCartLabel?: string;
}
/**
 * The `AddToCartButton` component renders a button that adds an item to the cart when pressed.
 * It must be a descendent of the `CartProvider` component.
 */
export declare function AddToCartButton(props: AddToCartButtonProps & BaseButtonProps): JSX.Element;
export {};

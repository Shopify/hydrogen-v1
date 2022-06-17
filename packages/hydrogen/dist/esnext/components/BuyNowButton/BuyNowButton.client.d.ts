import { BaseButtonProps } from '../BaseButton';
interface BuyNowButtonProps {
    /** The item quantity. Defaults to 1. */
    quantity?: number;
    /** The ID of the variant. */
    variantId: string;
    /** An array of cart line attributes that belong to the item being added to the cart. */
    attributes?: {
        key: string;
        value: string;
    }[];
}
/** The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout. */
export declare function BuyNowButton(props: BuyNowButtonProps & BaseButtonProps): JSX.Element;
export {};

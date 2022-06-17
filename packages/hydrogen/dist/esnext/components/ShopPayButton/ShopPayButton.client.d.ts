declare type ShopPayButtonProps = {
    /** A string of classes to apply to the `div` that wraps the Shop Pay button. */
    className?: string;
    /** A string that's applied to the [CSS custom property (variable)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) `--shop-pay-button-width` for the [Buy with Shop Pay component](https://shopify.dev/custom-storefronts/tools/web-components#buy-with-shop-pay-component). */
    width?: string;
} & ({
    /** An array of IDs of the variants to purchase with Shop Pay. This will only ever have a quantity of 1 for each variant. If you want to use other quantities, then use 'variantIdsAndQuantities'. */
    variantIds: string[];
    /** An array of variant IDs and quantities to purchase with Shop Pay. */
    variantIdsAndQuantities?: never;
} | {
    /** An array of IDs of the variants to purchase with Shop Pay. This will only ever have a quantity of 1 for each variant. If you want to use other quantities, then use 'variantIdsAndQuantities'. */
    variantIds?: never;
    /** An array of variant IDs and quantities to purchase with Shop Pay. */
    variantIdsAndQuantities: Array<{
        id: string;
        quantity: number;
    }>;
});
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'shop-pay-button': {
                variants: string;
                'store-url': string;
            };
        }
    }
}
/**
 * The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout.
 */
export declare function ShopPayButton({ variantIds, className, variantIdsAndQuantities, width, }: ShopPayButtonProps): JSX.Element;
/**
 * Takes a string in the format of "gid://shopify/ProductVariant/41007289630776" and returns a string of the ID part at the end: "41007289630776"
 */
export declare function getIdFromGid(id?: string): string | undefined;
export declare const MissingPropsErrorMessage = "You must pass in either \"variantIds\" or \"variantIdsAndQuantities\" to ShopPayButton";
export declare const DoublePropsErrorMessage = "You must provide either a variantIds or variantIdsAndQuantities prop, but not both in the ShopPayButton component";
export {};

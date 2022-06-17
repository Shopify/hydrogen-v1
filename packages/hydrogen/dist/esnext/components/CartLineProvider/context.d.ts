export declare const CartLineContext: import("react").Context<({
    __typename?: "CartLine" | undefined;
} & Pick<import("../../storefront-api-types").CartLine, "id" | "quantity"> & {
    attributes: ({
        __typename?: "Attribute" | undefined;
    } & Pick<import("../../storefront-api-types").Attribute, "key" | "value">)[];
    cost: {
        __typename?: "CartLineCost" | undefined;
    } & {
        totalAmount: {
            __typename?: "MoneyV2" | undefined;
        } & Pick<import("../../storefront-api-types").MoneyV2, "currencyCode" | "amount">;
        compareAtAmountPerQuantity?: import("../../storefront-api-types").Maybe<{
            __typename?: "MoneyV2" | undefined;
        } & Pick<import("../../storefront-api-types").MoneyV2, "currencyCode" | "amount">> | undefined;
    };
    merchandise: {
        __typename?: "ProductVariant" | undefined;
    } & Pick<import("../../storefront-api-types").ProductVariant, "id" | "title" | "availableForSale" | "requiresShipping"> & {
        compareAtPriceV2?: import("../../storefront-api-types").Maybe<{
            __typename?: "MoneyV2" | undefined;
        } & Pick<import("../../storefront-api-types").MoneyV2, "currencyCode" | "amount">> | undefined;
        priceV2: {
            __typename?: "MoneyV2" | undefined;
        } & Pick<import("../../storefront-api-types").MoneyV2, "currencyCode" | "amount">;
        image?: import("../../storefront-api-types").Maybe<{
            __typename?: "Image" | undefined;
        } & Pick<import("../../storefront-api-types").Image, "id" | "height" | "width" | "url" | "altText">> | undefined;
        product: {
            __typename?: "Product" | undefined;
        } & Pick<import("../../storefront-api-types").Product, "title" | "handle">;
        selectedOptions: ({
            __typename?: "SelectedOption" | undefined;
        } & Pick<import("../../storefront-api-types").SelectedOption, "name" | "value">)[];
    };
}) | null>;

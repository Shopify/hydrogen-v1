/**
 * The `useCountry` hook returns a tuple of the current localization country and a function for updating it.
 * It must be a descendent of a `LocalizationProvider` component.
 */
export declare function useCountry(): (({
    __typename?: "Country" | undefined;
} & Pick<import("../../storefront-api-types").Country, "name" | "isoCode">) | undefined)[];

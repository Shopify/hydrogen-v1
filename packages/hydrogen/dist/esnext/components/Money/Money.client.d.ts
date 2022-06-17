import React, { type ReactNode } from 'react';
import type { MoneyV2, UnitPriceMeasurement } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
interface CustomProps<ComponentGeneric extends React.ElementType> {
    /** An HTML tag or React Component to be rendered as the base element wrapper. The default is `div`. */
    as?: ComponentGeneric;
    /** An object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2). */
    data: PartialDeep<MoneyV2>;
    /** Whether to remove the currency symbol from the output. */
    withoutCurrency?: boolean;
    /** Whether to remove trailing zeros (fractional money) from the output. */
    withoutTrailingZeros?: boolean;
    /** A [UnitPriceMeasurement object](https://shopify.dev/api/storefront/latest/objects/unitpricemeasurement). */
    measurement?: PartialDeep<UnitPriceMeasurement>;
    /** Customizes the separator between the money output and the measurement output. Used with the `measurement` prop. Defaults to `'/'`. */
    measurementSeparator?: ReactNode;
}
declare type MoneyProps<ComponentGeneric extends React.ElementType> = CustomProps<ComponentGeneric> & Omit<React.ComponentPropsWithoutRef<ComponentGeneric>, keyof CustomProps<ComponentGeneric>>;
/**
 * The `Money` component renders a string of the Storefront API's
 * [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) according to the
 * `defaultLocale` in [the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
 */
export declare function Money<TTag extends React.ElementType>({ data, as, withoutCurrency, withoutTrailingZeros, measurement, measurementSeparator, ...passthroughProps }: MoneyProps<TTag>): JSX.Element;
export {};

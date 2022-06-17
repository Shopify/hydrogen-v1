import { CurrencyCode, MoneyV2 } from '../../storefront-api-types';
export declare type UseMoneyValue = {
    /**
     * The currency code from the `MoneyV2` object.
     */
    currencyCode: CurrencyCode;
    /**
     * The name for the currency code, returned by `Intl.NumberFormat`.
     */
    currencyName?: string;
    /**
     * The currency symbol returned by `Intl.NumberFormat`.
     */
    currencySymbol?: string;
    /**
     * The currency narrow symbol returned by `Intl.NumberFormat`.
     */
    currencyNarrowSymbol?: string;
    /**
     * The localized amount, without any currency symbols or non-number types from the `Intl.NumberFormat.formatToParts` parts.
     */
    amount: string;
    /**
     * All parts returned by `Intl.NumberFormat.formatToParts`.
     */
    parts: Intl.NumberFormatPart[];
    /**
     * A string returned by `new Intl.NumberFormat` for the amount and currency code,
     * using the `defaultLocale` value in [`hydrogenConfig.shopify`](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
     */
    localizedString: string;
    /**
     * The `MoneyV2` object provided as an argument to the hook.
     */
    original: MoneyV2;
    /**
     * A string with trailing zeros removed from the fractional part, if any exist. If there are no trailing zeros, then the fractional part remains.
     * For example, `$640.00` turns into `$640`.
     * `$640.42` remains `$640.42`.
     */
    withoutTrailingZeros: string;
    /**
     * A string without currency and without trailing zeros removed from the fractional part, if any exist. If there are no trailing zeros, then the fractional part remains.
     * For example, `$640.00` turns into `640`.
     * `$640.42` turns into `640.42`.
     */
    withoutTrailingZerosAndCurrency: string;
};
/**
 * The `useMoney` hook takes a [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) and returns a
 * default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by
 * [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).
 */
export declare function useMoney(money: MoneyV2): UseMoneyValue;

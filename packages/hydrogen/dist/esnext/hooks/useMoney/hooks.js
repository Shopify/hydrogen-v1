import { useMemo } from 'react';
import { useShop } from '../../foundation/useShop';
/**
 * The `useMoney` hook takes a [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) and returns a
 * default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by
 * [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).
 */
export function useMoney(money) {
    const { locale } = useShop();
    const amount = parseFloat(money.amount);
    const options = useMemo(() => ({
        style: 'currency',
        currency: money.currencyCode,
    }), [money.currencyCode]);
    const defaultFormatter = useLazyFormatter(locale, options);
    const nameFormatter = useLazyFormatter(locale, {
        ...options,
        currencyDisplay: 'name',
    });
    const narrowSymbolFormatter = useLazyFormatter(locale, {
        ...options,
        currencyDisplay: 'narrowSymbol',
    });
    const withoutTrailingZerosFormatter = useLazyFormatter(locale, {
        ...options,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const withoutCurrencyFormatter = useLazyFormatter(locale);
    const withoutTrailingZerosOrCurrencyFormatter = useLazyFormatter(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const isPartCurrency = (part) => part.type === 'currency';
    // By wrapping these properties in functions, we only
    // create formatters if they are going to be used.
    const lazyFormatters = useMemo(() => ({
        original: () => money,
        currencyCode: () => money.currencyCode,
        localizedString: () => defaultFormatter().format(amount),
        parts: () => defaultFormatter().formatToParts(amount),
        withoutTrailingZeros: () => amount % 1 === 0
            ? withoutTrailingZerosFormatter().format(amount)
            : defaultFormatter().format(amount),
        withoutTrailingZerosAndCurrency: () => amount % 1 === 0
            ? withoutTrailingZerosOrCurrencyFormatter().format(amount)
            : withoutCurrencyFormatter().format(amount),
        currencyName: () => nameFormatter().formatToParts(amount).find(isPartCurrency)?.value ??
            money.currencyCode,
        currencySymbol: () => defaultFormatter().formatToParts(amount).find(isPartCurrency)?.value ??
            money.currencyCode,
        currencyNarrowSymbol: () => narrowSymbolFormatter().formatToParts(amount).find(isPartCurrency)
            ?.value ?? '',
        amount: () => defaultFormatter()
            .formatToParts(amount)
            .filter((part) => ['decimal', 'fraction', 'group', 'integer', 'literal'].includes(part.type))
            .map((part) => part.value)
            .join(''),
    }), [
        money,
        amount,
        nameFormatter,
        defaultFormatter,
        narrowSymbolFormatter,
        withoutCurrencyFormatter,
        withoutTrailingZerosFormatter,
        withoutTrailingZerosOrCurrencyFormatter,
    ]);
    // Call functions automatically when the properties are accessed
    // to keep these functions as an implementation detail.
    return useMemo(() => new Proxy(lazyFormatters, {
        get: (target, key) => Reflect.get(target, key)?.call(null),
    }), [lazyFormatters]);
}
function useLazyFormatter(locale, options) {
    return useMemo(() => {
        let memoized;
        return () => (memoized ??= new Intl.NumberFormat(locale, options));
    }, [locale, options]);
}

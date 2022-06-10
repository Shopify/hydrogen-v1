import {useMemo, useCallback} from 'react';
import {useShop} from '../../foundation/useShop';
import {CurrencyCode, MoneyV2} from '../../storefront-api-types';

export type UseMoneyValue = {
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
export function useMoney(money: MoneyV2): UseMoneyValue {
  const memoizedFormats = useMemoizedFormats(money);

  return useMemo<UseMoneyValue>(() => {
    const memoizedKeys = Object.keys(memoizedFormats).reduce((acc, key) => {
      acc[key] = undefined;
      return acc;
    }, Object.create(null) as Record<string, any>);

    return new Proxy(
      {
        ...memoizedKeys,
        currencyCode: money.currencyCode,
        original: money,
      } as UseMoneyValue,
      {
        get: (target, key) =>
          key in memoizedKeys
            ? Reflect.get(memoizedFormats, key).call(null)
            : Reflect.get(target, key),
      }
    );
  }, [money, memoizedFormats]);
}

function useMemoizedFormats(money: MoneyV2) {
  const {locale} = useShop();

  const options = useMemo(
    () => ({
      style: 'currency',
      currency: money.currencyCode,
    }),
    [money.currencyCode]
  );

  const amount = parseFloat(money.amount);

  const value = useCallback(
    () => new Intl.NumberFormat(locale, options).format(amount),
    [amount, locale, options]
  );

  const baseParts = useCallback(
    () => new Intl.NumberFormat(locale, options).formatToParts(amount),
    [locale, options, amount]
  );

  const nameParts = useCallback(
    () =>
      new Intl.NumberFormat(locale, {
        ...options,
        currencyDisplay: 'name',
      }).formatToParts(amount),
    [locale, options, amount]
  );

  const narrowParts = useCallback(
    () =>
      new Intl.NumberFormat(locale, {
        ...options,
        currencyDisplay: 'narrowSymbol',
      }).formatToParts(amount),
    [locale, options, amount]
  );

  const withoutTrailingZerosFormatter = useCallback(
    () =>
      new Intl.NumberFormat(locale, {
        ...options,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [locale, options]
  );

  const withoutCurrencyFormatter = useCallback(
    () => new Intl.NumberFormat(locale),
    [locale]
  );

  const withoutTrailingZerosOrCurrencyFormatter = useCallback(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [locale]
  );

  return {
    localizedString: value,
    parts: baseParts,

    withoutTrailingZeros: useCallback(
      () =>
        amount % 1 === 0
          ? withoutTrailingZerosFormatter().format(amount)
          : value(),
      [amount, value, withoutTrailingZerosFormatter]
    ),

    withoutTrailingZerosAndCurrency: useCallback(
      () =>
        amount % 1 === 0
          ? withoutTrailingZerosOrCurrencyFormatter().format(amount)
          : withoutCurrencyFormatter().format(amount),
      [
        amount,
        withoutTrailingZerosOrCurrencyFormatter,
        withoutCurrencyFormatter,
      ]
    ),

    currencyName: useCallback(
      () =>
        nameParts().find((part) => part.type === 'currency')?.value ?? // e.g. "US dollars"
        money.currencyCode,
      [nameParts, money]
    ),

    currencySymbol: useCallback(
      () =>
        baseParts().find((part) => part.type === 'currency')?.value ?? // e.g. "USD"
        money.currencyCode,
      [baseParts, money]
    ),

    currencyNarrowSymbol: useCallback(
      () =>
        narrowParts().find((part) => part.type === 'currency')?.value ?? // e.g. "$"
        '',
      [narrowParts]
    ),

    amount: useCallback(
      () =>
        baseParts()
          .filter((part) =>
            ['decimal', 'fraction', 'group', 'integer', 'literal'].includes(
              part.type
            )
          )
          .map((part) => part.value)
          .join(''),
      [baseParts]
    ),
  };
}

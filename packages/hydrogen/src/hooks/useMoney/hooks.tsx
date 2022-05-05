import {useMemo} from 'react';
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
   * using the `shopify.config.js` locale.
   */
  localizedString: string;
  /**
   * The `MoneyV2` object provided as an argument to the hook.
   */
  original: MoneyV2;
  /**
   * A string with trailing zeros removed from the fractional part, if there were any. If there are not trailing zeros, they remain in the string.
   * `$640.00` turns into `$640`
   * `$640.42` remains `$640.42`
   */
  withoutTrailingZeros: string;
  /**
   * A string without currency and without trailing zeros removed from the fractional part, if there were any. If there are not trailing zeros, they remain in the string.
   * `$640.00` turns into `640`
   * `$640.42` turns into `640.42`
   */
  withoutTrailingZerosAndCurrency: string;
};

/**
 * The `useMoney` hook takes a [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) and returns a
 * default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by
 * [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).
 */
export function useMoney(money: MoneyV2): UseMoneyValue {
  const {locale} = useShop();

  const options = useMemo(
    () => ({
      style: 'currency',
      currency: money.currencyCode,
    }),
    [money.currencyCode]
  );

  const amount = parseFloat(money.amount);

  const standardCurrencyFormatter = new Intl.NumberFormat(locale, options);

  const value = useMemo(
    () => standardCurrencyFormatter.format(amount),
    [amount, locale, options]
  );

  const baseParts = new Intl.NumberFormat(locale, options).formatToParts(
    amount
  );
  const nameParts = new Intl.NumberFormat(locale, {
    ...options,
    currencyDisplay: 'name',
  }).formatToParts(amount);
  const narrowParts = new Intl.NumberFormat(locale, {
    ...options,
    currencyDisplay: 'narrowSymbol',
  }).formatToParts(amount);

  const withoutTrailingZerosFormatter = new Intl.NumberFormat(locale, {
    ...options,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const withoutCurrencyFormatter = new Intl.NumberFormat(locale);

  const withoutTrailingZerosOrCurrencyFormatter = new Intl.NumberFormat(
    locale,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );

  const withoutTrailingZeros =
    amount % 1 === 0
      ? withoutTrailingZerosFormatter.format(amount)
      : standardCurrencyFormatter.format(amount);

  const withoutTrailingZerosAndCurrency =
    amount % 1 === 0
      ? withoutTrailingZerosOrCurrencyFormatter.format(amount)
      : withoutCurrencyFormatter.format(amount);

  const moneyValue = useMemo<UseMoneyValue>(
    () => ({
      currencyCode: money.currencyCode,
      currencyName:
        nameParts.find((part) => part.type === 'currency')?.value ?? // e.g. "US dollars"
        money.currencyCode,
      currencySymbol:
        baseParts.find((part) => part.type === 'currency')?.value ?? // e.g. "USD"
        money.currencyCode,
      currencyNarrowSymbol:
        narrowParts.find((part) => part.type === 'currency')?.value ?? // e.g. "$"
        '',
      parts: baseParts,
      localizedString: value,
      amount: baseParts
        .filter((part) =>
          ['decimal', 'fraction', 'group', 'integer', 'literal'].includes(
            part.type
          )
        )
        .map((part) => part.value)
        .join(''),
      original: money,
      withoutTrailingZeros,
      withoutTrailingZerosAndCurrency,
    }),
    [baseParts, money, nameParts, narrowParts, value]
  );

  return moneyValue;
}

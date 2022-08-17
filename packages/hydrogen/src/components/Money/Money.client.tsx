import React, {type ReactNode} from 'react';
import {useMoney} from '../../hooks/index.js';
import type {
  MoneyV2,
  UnitPriceMeasurement,
} from '../../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

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

// This article helps understand the typing here https://www.benmvp.com/blog/polymorphic-react-components-typescript/ Ben is the best :)
type MoneyProps<ComponentGeneric extends React.ElementType> =
  CustomProps<ComponentGeneric> &
    Omit<
      React.ComponentPropsWithoutRef<ComponentGeneric>,
      keyof CustomProps<ComponentGeneric>
    >;

/**
 * The `Money` component renders a string of the Storefront API's
 * [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) according to the
 * `locale` in [the `LocalizationProvider` component](https://shopify.dev/api/hydrogen/components/localization/localizationprovider).
 */
export function Money<TTag extends React.ElementType>({
  data,
  as,
  withoutCurrency,
  withoutTrailingZeros,
  measurement,
  measurementSeparator = '/',
  ...passthroughProps
}: MoneyProps<TTag>) {
  if (!isMoney(data)) {
    throw new Error(
      `<Money/> needs a valid 'data' prop that has 'amount' and 'currencyCode'`
    );
  }
  const moneyObject = useMoney(data);
  const Wrapper = as ?? 'div';

  let output = moneyObject.localizedString;

  if (withoutCurrency || withoutTrailingZeros) {
    if (withoutCurrency && !withoutTrailingZeros) {
      output = moneyObject.amount;
    } else if (!withoutCurrency && withoutTrailingZeros) {
      output = moneyObject.withoutTrailingZeros;
    } else {
      // both
      output = moneyObject.withoutTrailingZerosAndCurrency;
    }
  }

  return (
    <Wrapper {...passthroughProps}>
      {output}
      {measurement && measurement.referenceUnit && (
        <>
          {measurementSeparator}
          {measurement.referenceUnit}
        </>
      )}
    </Wrapper>
  );
}

// required in order to narrow the money object down and make TS happy
function isMoney(maybeMoney: PartialDeep<MoneyV2>): maybeMoney is MoneyV2 {
  return (
    typeof maybeMoney.amount === 'string' &&
    !!maybeMoney.amount &&
    typeof maybeMoney.currencyCode === 'string' &&
    !!maybeMoney.currencyCode
  );
}

import React from 'react';
import {useMoney} from '../../hooks';
import type {MoneyV2} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

interface MoneyProps<TTag> {
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: TTag;
  /** An object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2). */
  data: PartialDeep<MoneyV2>;
  /** Whether to remove the currency symbol from the output. */
  withoutCurrency?: boolean;
  /** Whether to remove trailing zeros (fractional money) from the output. */
  withoutTrailingZeros?: boolean;
}

/**
 * The `Money` component renders a string of the Storefront API's
 * [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) according to the
 * `defaultLocale` in [the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
 */
export function Money<TTag extends keyof JSX.IntrinsicElements = 'div'>(
  props: JSX.IntrinsicElements[TTag] & MoneyProps<TTag>
) {
  const {data, as, withoutCurrency, withoutTrailingZeros, ...passthroughProps} =
    props;
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

  return <Wrapper {...passthroughProps}>{output}</Wrapper>;
}

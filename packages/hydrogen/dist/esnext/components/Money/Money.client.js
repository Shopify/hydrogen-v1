import React from 'react';
import { useMoney } from '../../hooks';
/**
 * The `Money` component renders a string of the Storefront API's
 * [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) according to the
 * `defaultLocale` in [the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
 */
export function Money({ data, as, withoutCurrency, withoutTrailingZeros, measurement, measurementSeparator = '/', ...passthroughProps }) {
    if (!isMoney(data)) {
        throw new Error(`<Money/> needs a valid 'data' prop that has 'amount' and 'currencyCode'`);
    }
    const moneyObject = useMoney(data);
    const Wrapper = as ?? 'div';
    let output = moneyObject.localizedString;
    if (withoutCurrency || withoutTrailingZeros) {
        if (withoutCurrency && !withoutTrailingZeros) {
            output = moneyObject.amount;
        }
        else if (!withoutCurrency && withoutTrailingZeros) {
            output = moneyObject.withoutTrailingZeros;
        }
        else {
            // both
            output = moneyObject.withoutTrailingZerosAndCurrency;
        }
    }
    return (React.createElement(Wrapper, { ...passthroughProps },
        output,
        measurement && measurement.referenceUnit && (React.createElement(React.Fragment, null,
            measurementSeparator,
            measurement.referenceUnit))));
}
// required in order to narrow the money object down and make TS happy
function isMoney(maybeMoney) {
    return (typeof maybeMoney.amount === 'string' &&
        !!maybeMoney.amount &&
        typeof maybeMoney.currencyCode === 'string' &&
        !!maybeMoney.currencyCode);
}

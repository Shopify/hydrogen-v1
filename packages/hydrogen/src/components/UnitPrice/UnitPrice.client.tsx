import React from 'react';
import {Money} from '../Money';
import type {UnitPriceFragmentFragment} from './UnitPriceFragment';

export interface UnitPriceProps<TTag> {
  /** A [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2). */
  data: UnitPriceFragmentFragment['unitPrice'];
  /** A [`UnitPriceMeasurement` object](/api/storefront/reference/products/unitpricemeasurement). */
  measurement: UnitPriceFragmentFragment['unitPriceMeasurement'];
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: TTag;
}

/**
 * The `UnitPrice` component renders a string with a [UnitPrice](/themes/pricing-payments/unit-pricing) as the
 * [Storefront API's `MoneyV2` object](/api/storefront/reference/common-objects/moneyv2) with a reference unit from the [Storefront API's `UnitPriceMeasurement` object](/api/storefront/reference/products/unitpricemeasurement).
 */
export function UnitPrice<TTag extends keyof JSX.IntrinsicElements = 'div'>(
  props: JSX.IntrinsicElements[TTag] & UnitPriceProps<TTag>
) {
  const {data, measurement, as, ...passthroughProps} = props;

  if (!data) {
    console.warn(`No "data" prop was passed to <UnitPrice/>`);
    return null;
  }
  if (!measurement) {
    console.warn(`No "measurement" prop was passed to <UnitPrice/>`);
    return null;
  }
  const Wrapper: any = as ?? 'div';

  return (
    <Wrapper {...passthroughProps}>
      <Money data={data} />/{measurement.referenceUnit}
    </Wrapper>
  );
}

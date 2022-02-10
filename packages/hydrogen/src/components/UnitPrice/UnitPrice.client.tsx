import React, {ElementType} from 'react';
import {Props} from '../types';
import {UnitPriceMeasurement, MoneyV2} from '../../graphql/types/types';
import {Money} from '../Money';
import {UnitPriceFragment as Fragment} from '../../graphql/graphql-constants';

export interface UnitPriceProps {
  /** A [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2). */
  unitPrice: MoneyV2;
  /** A [`UnitPriceMeasurement` object](/api/storefront/reference/products/unitpricemeasurement). */
  unitPriceMeasurement: UnitPriceMeasurement;
  /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
  as?: ElementType;
}

/**
 * The `UnitPrice` component renders a string with a [UnitPrice](/themes/pricing-payments/unit-pricing) as the
 * [Storefront API's `MoneyV2` object](/api/storefront/reference/common-objects/moneyv2) with a reference unit from the [Storefront API's `UnitPriceMeasurement` object](/api/storefront/reference/products/unitpricemeasurement).
 */
export function UnitPrice<TTag extends ElementType>(
  props: Props<TTag> & UnitPriceProps
) {
  const {unitPrice, unitPriceMeasurement, as, ...passthroughProps} = props;
  const Wrapper: any = as ?? 'div';

  return (
    <Wrapper {...passthroughProps}>
      <Money money={unitPrice} />/{unitPriceMeasurement.referenceUnit}
    </Wrapper>
  );
}

UnitPrice.Fragment = Fragment;
export const UnitPriceFragment = Fragment;

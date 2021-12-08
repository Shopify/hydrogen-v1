import React, {ElementType, ReactNode} from 'react';
import {Props} from '../types';
import {UnitPriceMeasurement, MoneyV2} from '../../graphql/types/types';
import {useMoney} from '../../hooks';
import {Money} from '../Money';
import {UnitPriceFragment as Fragment} from '../../graphql/graphql-constants';

export interface UnitPriceProps {
  /** A [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2). */
  unitPrice: MoneyV2;
  /** A [`UnitPriceMeasurement` object](/api/storefront/reference/products/unitpricemeasurement). */
  unitPriceMeasurement: UnitPriceMeasurement;
  /** A function that takes an object returned by the `UnitPrice` component and returns a `ReactNode`. */
  children?: ReactNode;
  /** A `ReactNode` */
  as?: ReactNode;
}

/**
 * The `UnitPrice` component renders a string with a [UnitPrice](/themes/pricing-payments/unit-pricing) as the
 * [Storefront API's `MoneyV2` object](/api/storefront/reference/common-objects/moneyv2) with a reference unit from the [Storefront API's `UnitPriceMeasurement` object](/api/storefront/reference/products/unitpricemeasurement).
 *
 * If `children` is a function, then it will provide render props for the `children` corresponding to the object
 * returned by the `useMoney` hook and the `UnitPriceMeasurement` object.
 */
export function UnitPrice<TTag extends ElementType>(
  props: Props<TTag> & UnitPriceProps
) {
  const {unitPrice, unitPriceMeasurement, children, as, ...passthroughProps} =
    props;
  const Wrapper: any = as ?? 'div';
  const unitPriceMoneyObject = useMoney(unitPrice);
  const unitPriceAndMeasurementObject = {
    ...unitPriceMoneyObject,
    ...unitPriceMeasurement,
  };

  return (
    <Wrapper {...passthroughProps}>
      {typeof children === 'function' ? (
        children(unitPriceAndMeasurementObject)
      ) : (
        <>
          <Money money={unitPrice} />/{unitPriceMeasurement.referenceUnit}
        </>
      )}
    </Wrapper>
  );
}

UnitPrice.Fragment = Fragment;
export const UnitPriceFragment = Fragment;

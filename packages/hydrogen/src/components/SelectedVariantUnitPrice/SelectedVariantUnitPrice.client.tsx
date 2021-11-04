import React, {ElementType} from 'react';
import {useProduct} from '../ProductProvider';
import {UnitPrice} from '../UnitPrice';
import {Props} from '../types';

/**
 * The `SelectedVariantUnitPrice` component renders a `UnitPrice` component for the product's selected variant's unit price.
 * It must be a descendent of a `ProductProvider`.
 */
export function SelectedVariantUnitPrice<TTag extends ElementType>(
  props: Props<TTag>
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  return product.selectedVariant?.unitPrice &&
    product.selectedVariant?.unitPriceMeasurement ? (
    <UnitPrice
      {...props}
      unitPrice={product.selectedVariant.unitPrice}
      unitPriceMeasurement={product.selectedVariant.unitPriceMeasurement}
    />
  ) : null;
}

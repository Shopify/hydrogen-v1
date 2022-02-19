import React, {ElementType} from 'react';
import {MoneyV2} from '../../graphql/types/types';
import {Money, MoneyProps} from '../Money';
import {useProduct} from '../ProductProvider';
import {Props} from '../types';

export interface ProductPriceProps extends Omit<MoneyProps, 'data'> {
  /** The type of price. Valid values: `regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
  /** The type of value. Valid values: `min` (default) or `max`. */
  valueType?: 'max' | 'min';
  variantId?: string;
}

/**
 * The `ProductPrice` component renders a `Money` component with the product
 * [`priceRange`](/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range. It must be a descendent of the `ProductProvider` component.
 */
export function ProductPrice<TTag extends ElementType>(
  props: Props<TTag> & ProductPriceProps
) {
  const product = useProduct();
  const {
    priceType = 'regular',
    variantId,
    valueType = 'min',
    ...passthroughProps
  } = props;

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  let price: MoneyV2 | undefined | null;

  const variant = variantId
    ? product?.variants?.find((variant) => variant.id === variantId)
    : null;

  if (priceType === 'compareAt') {
    if (variantId && variant) {
      price = variant?.compareAtPriceV2;
    } else if (valueType === 'max') {
      price = product?.compareAtPriceRange?.maxVariantPrice;
    } else {
      price = product?.compareAtPriceRange?.minVariantPrice;
    }
  } else {
    if (variantId && variant) {
      price = variant?.priceV2;
    } else if (valueType === 'max') {
      price = product.priceRange?.maxVariantPrice;
    } else {
      price = product.priceRange?.minVariantPrice;
    }
  }

  if (price == null) {
    return null;
  }

  return <Money {...passthroughProps} data={price} />;
}

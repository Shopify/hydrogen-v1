import React from 'react';
import {MoneyV2, UnitPriceMeasurement} from '../../graphql/types/types';
import {Money} from '../Money';
import {UnitPrice} from '../UnitPrice';
import {flattenConnection} from '../../utilities';
import type {Product} from '../../graphql/types/types';

export interface ProductPriceProps {
  /** The type of price. Valid values: `regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
  /** The type of value. Valid values: `min` (default), `max` or `unit`. */
  valueType?: 'max' | 'min' | 'unit';
  /** The ID of the variant. */
  variantId?: string;
}

/**
 * The `ProductPrice` component renders a `Money` component with the product
 * [`priceRange`](/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range. It must be a descendent of the `ProductProvider` component.
 */
export function ProductPrice<TTag extends keyof JSX.IntrinsicElements>(
  props: (
    | Omit<React.ComponentProps<typeof UnitPrice>, 'data' | 'measurement'>
    | Omit<React.ComponentProps<typeof Money>, 'data'>
  ) &
    ProductPriceProps
) {
  const {product, ...options} = props;
  const prodPriceReturn = getProductPrice(product, options);
  if (!prodPriceReturn) return null;
  const {measurement, price} = prodPriceReturn;

  if (measurement) {
    return (
      <UnitPrice<TTag>
        {...passthroughProps}
        data={price}
        measurement={measurement}
      />
    );
  }

  return <Money<TTag> {...passthroughProps} data={price} />;
}

type getProductPriceReturn = {
  price: MoneyV2 | undefined | null;
  measurement: UnitPriceMeasurement | undefined | null;
} | null;
function getProductPrice(
  product: Partial<Product>,
  options: ProductPriceProps
): getProductPriceReturn {
  const {priceType = 'regular', variantId, valueType = 'min'} = options;

  if (product == null) {
    throw new Error('Need a product');
  }

  let price: MoneyV2 | undefined | null;
  let measurement: UnitPriceMeasurement | undefined | null;

  const variant =
    variantId && product.variants
      ? flattenConnection(product?.variants).find(
          (variant) => variant.id === variantId
        )
      : null;

  if (priceType === 'compareAt') {
    if (variantId && variant) {
      if (variant.compareAtPriceV2?.amount === variant.priceV2?.amount) {
        return null;
      }
      price = variant.compareAtPriceV2;
    } else if (valueType === 'max') {
      price = product?.compareAtPriceRange?.maxVariantPrice;
    } else {
      price = product?.compareAtPriceRange?.minVariantPrice;
    }
  } else {
    if (variantId && variant) {
      price = variant.priceV2;
      if (valueType === 'unit') {
        price = variant.unitPrice;
        measurement = variant.unitPriceMeasurement;
      }
    } else if (valueType === 'max') {
      price = product.priceRange?.maxVariantPrice;
    } else {
      price = product.priceRange?.minVariantPrice;
    }
  }

  if (price == null) {
    return null;
  }

  return {price, measurement};
}

import React from 'react';
import type {
  MoneyV2,
  UnitPriceMeasurement,
  Product,
} from './storefront-api-types.js';
import {Money, type MoneyProps} from './Money.js';
import type {PartialDeep} from 'type-fest';
import {flattenConnection} from './flatten-connection.js';

interface ProductPriceProps {
  /** A [Product object](https://shopify.dev/api/storefront/reference/products/product). */
  data: PartialDeep<Product>;
  /** The type of price. Valid values: `regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
  /** The type of value. Valid values: `min` (default), `max` or `unit`. */
  valueType?: 'max' | 'min' | 'unit';
  /** The ID of the variant. */
  variantId?: string;
}

/**
 * The `ProductPrice` component renders a `Money` component with the product
 * [`priceRange`](https://shopify.dev/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range.
 */
export function ProductPrice<ComponentGeneric extends React.ElementType>(
  props: ProductPriceProps &
    Omit<MoneyProps<ComponentGeneric>, 'data' | 'measurement'>
) {
  const {
    priceType = 'regular',
    variantId,
    valueType = 'min',
    data: product,
    ...passthroughProps
  } = props;

  if (product == null) {
    throw new Error(`<ProductPrice/> requires a product as the 'data' prop`);
  }

  let price: Partial<MoneyV2> | undefined | null;
  let measurement: Partial<UnitPriceMeasurement> | undefined | null;

  const variant = variantId
    ? flattenConnection(product?.variants ?? {}).find(
        (variant) => variant?.id === variantId
      ) ?? null
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

  if (!price) {
    return null;
  }

  if (measurement) {
    return (
      <Money {...passthroughProps} data={price} measurement={measurement} />
    );
  }

  return <Money {...passthroughProps} data={price} />;
}

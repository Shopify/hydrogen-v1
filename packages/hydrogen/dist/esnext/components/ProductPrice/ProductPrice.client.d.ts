import React from 'react';
import type { Product } from '../../storefront-api-types';
import { Money } from '../Money';
import type { PartialDeep } from 'type-fest';
export interface ProductPriceProps {
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
export declare function ProductPrice(props: Omit<React.ComponentProps<typeof Money>, 'data' | 'measurement'> & ProductPriceProps): JSX.Element | null;

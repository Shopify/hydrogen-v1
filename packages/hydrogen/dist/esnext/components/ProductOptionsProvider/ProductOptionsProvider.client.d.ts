import React from 'react';
import type { Product, ProductVariant as ProductVariantType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
declare type InitialVariantId = ProductVariantType['id'] | null;
interface ProductOptionsProviderProps {
    /** A [Product object](https://shopify.dev/api/storefront/reference/products/product). */
    data: PartialDeep<Product>;
    /** A `ReactNode` element. */
    children: React.ReactNode;
    /**
     * The initially selected variant.
     * The following logic applies to `initialVariantId`:
     * 1. If `initialVariantId` is provided, then it's used even if it's out of stock.
     * 2. If `initialVariantId` is provided but is `null`, then no variant is used.
     * 3. If nothing is passed to `initialVariantId` then the first available / in-stock variant is used.
     * 4. If nothing is passed to `initialVariantId` and no variants are in stock, then the first variant is used.
     */
    initialVariantId?: InitialVariantId;
}
export declare function ProductOptionsProvider({ children, data: product, initialVariantId: explicitVariantId, }: ProductOptionsProviderProps): JSX.Element;
export {};

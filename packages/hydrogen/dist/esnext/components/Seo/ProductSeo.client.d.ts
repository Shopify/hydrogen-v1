import type { Scalars, Product as ProductType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export declare function ProductSeo({ url, title, description, seo, vendor, featuredImage, variants, }: PartialDeep<ProductType> & {
    url: Scalars['URL'];
}): JSX.Element;

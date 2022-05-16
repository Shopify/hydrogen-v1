import {createContext} from 'react';
import {ProductOptionsHookValue} from '../../hooks';
import {ParsedMetafield} from '../../types';
import type {
  Collection,
  Image,
  Product as ProductType,
  ProductVariant as ProductVariantType,
  MediaEdge as MediaEdgeType,
} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

export const ProductContext = createContext<ProductContextType | null>(null);

export type ProductContextType = PartialDeep<
  Omit<
    ProductType,
    | 'media'
    | 'metafields'
    | 'images'
    | 'collections'
    | 'variants'
    | 'sellingPlanGroups'
    | 'options'
  > & {
    media?: MediaEdgeType['node'];
    mediaConnection?: ProductType['media'];
    metafields?: ParsedMetafield[];
    metafieldsConnection?: ProductType['metafields'];
    images?: Partial<Image>[];
    imagesConnection?: ProductType['images'];
    collections?: Partial<Collection>[];
    collectionsConnection?: ProductType['collections'];
    variants?: Partial<ProductVariantType>[];
    variantsConnection?: ProductType['variants'];
  }
>;

export const ProductOptionsContext =
  createContext<ProductOptionsHookValue | null>(null);

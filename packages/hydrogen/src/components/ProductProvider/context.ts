import {createContext} from 'react';
import {ProductOptionsHookValue} from '../../hooks';
import {ParsedMetafield} from '../../types';
import {ProductProviderFragmentFragment} from './ProductProviderFragment';
import {Product} from './types';
import {Collection, Image} from '../../storefront-api-types';
import type {Variant} from '../../hooks/useProductOptions';

export const ProductContext = createContext<ProductContextType | null>(null);

export type ProductContextType = Omit<
  Product,
  | 'media'
  | 'metafields'
  | 'images'
  | 'collections'
  | 'variants'
  | 'sellingPlanGroups'
  | 'options'
> & {
  media?: ProductProviderFragmentFragment['media']['edges'][0]['node'][];
  mediaConnection?: Product['media'];
  metafields?: ParsedMetafield[];
  metafieldsConnection?: Product['metafields'];
  images?: Partial<Image>[];
  imagesConnection?: Product['images'];
  collections?: Partial<Collection>[];
  collectionsConnection?: Product['collections'];
  variants?: Partial<Variant>[];
  variantsConnection?: Product['variants'];
};

export const ProductOptionsContext =
  createContext<ProductOptionsHookValue | null>(null);

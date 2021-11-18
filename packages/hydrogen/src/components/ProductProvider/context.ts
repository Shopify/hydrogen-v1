import {createContext} from 'react';
import {ProductOptionsHookValue} from '../../hooks';
import {GraphQLConnection, ParsedMetafield, RawMetafield} from '../../types';
import {ProductProviderFragmentFragment} from './ProductProviderFragment';
import {Product} from './types';
import {Collection, Image} from '../../graphql/types/types';

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
> &
  ProductOptionsHookValue & {
    media?: ProductProviderFragmentFragment['media']['edges'][0]['node'][];
    mediaConnection?: ProductProviderFragmentFragment['media'];
    metafields?: ParsedMetafield[];
    metafieldsConnection?: GraphQLConnection<RawMetafield>;
    images?: Partial<Image>[];
    imagesConnection?: GraphQLConnection<Partial<Image>>;
    collections?: Partial<Collection>[];
    collectionsConnection?: GraphQLConnection<Partial<Collection>>;
  };

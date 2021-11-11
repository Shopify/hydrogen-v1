import * as Types from '../../graphql/types/types';

import {ImageFragmentFragment} from '../Image/ImageFragment';
import {ProductProviderFragmentFragment} from '../ProductProvider/ProductProviderFragment';
export type CollectionProviderFragmentFragment = {
  __typename?: 'Collection';
} & Pick<Types.Collection, 'descriptionHtml' | 'handle' | 'id' | 'title'> & {
    image?: Types.Maybe<{__typename?: 'Image'} & ImageFragmentFragment>;
    products: {__typename?: 'ProductConnection'} & {
      edges: Array<
        {__typename?: 'ProductEdge'} & {
          node: {__typename?: 'Product'} & ProductProviderFragmentFragment;
        }
      >;
      pageInfo: {__typename?: 'PageInfo'} & Pick<Types.PageInfo, 'hasNextPage'>;
    };
  };

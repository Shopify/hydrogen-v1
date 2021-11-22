import * as Types from '../../graphql/types/types';

import {ImageFragmentFragment} from '../Image/ImageFragment';
export type MetafieldFragmentFragment = {__typename?: 'Metafield'} & Pick<
  Types.Metafield,
  | 'id'
  | 'type'
  | 'namespace'
  | 'key'
  | 'value'
  | 'createdAt'
  | 'updatedAt'
  | 'description'
> & {
    reference?: Types.Maybe<
      | ({__typename: 'MediaImage'} & Pick<
          Types.MediaImage,
          'id' | 'mediaContentType'
        > & {
            image?: Types.Maybe<{__typename?: 'Image'} & ImageFragmentFragment>;
          })
      | {__typename: 'Page'}
      | {__typename: 'Product'}
      | {__typename: 'ProductVariant'}
    >;
  };

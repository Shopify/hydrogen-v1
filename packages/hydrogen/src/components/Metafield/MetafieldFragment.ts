/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

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
            image?: Types.Maybe<
              {__typename?: 'Image'} & Pick<
                Types.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          })
      | {__typename: 'Page'}
      | {__typename: 'Product'}
      | {__typename: 'ProductVariant'}
    >;
  };

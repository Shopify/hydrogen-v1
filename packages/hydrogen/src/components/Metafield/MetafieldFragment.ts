/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type MetafieldFragmentFragment = {
  __typename?: 'Metafield';
  id: string;
  type: string;
  namespace: string;
  key: string;
  value: string;
  createdAt: any;
  updatedAt: any;
  description?: string | null;
  reference?:
    | {
        __typename: 'MediaImage';
        id: string;
        mediaContentType: Types.MediaContentType;
        image?: {
          __typename?: 'Image';
          id?: string | null;
          url: any;
          altText?: string | null;
          width?: number | null;
          height?: number | null;
        } | null;
      }
    | {__typename: 'Page'}
    | {__typename: 'Product'}
    | {__typename: 'ProductVariant'}
    | null;
};

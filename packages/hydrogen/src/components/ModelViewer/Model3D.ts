/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type Model3DFragmentFragment = {
  __typename?: 'Model3d';
  id: string;
  alt?: string | null;
  mediaContentType: Types.MediaContentType;
  previewImage?: {__typename?: 'Image'; url: any} | null;
  sources: Array<{__typename?: 'Model3dSource'; url: string}>;
};

/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type VideoFragmentFragment = {
  __typename?: 'Video';
  id: string;
  previewImage?: {__typename?: 'Image'; url: any} | null;
  sources: Array<{__typename?: 'VideoSource'; mimeType: string; url: string}>;
};

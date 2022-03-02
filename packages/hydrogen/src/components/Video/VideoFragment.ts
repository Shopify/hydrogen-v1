/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type VideoFragmentFragment = {__typename?: 'Video'} & Pick<
  Types.Video,
  'id'
> & {
    previewImage?: Types.Maybe<
      {__typename?: 'Image'} & Pick<Types.Image, 'url'>
    >;
    sources: Array<
      {__typename?: 'VideoSource'} & Pick<Types.VideoSource, 'mimeType' | 'url'>
    >;
  };

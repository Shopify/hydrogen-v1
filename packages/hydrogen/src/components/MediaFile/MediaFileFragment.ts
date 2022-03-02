/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type MediaFileFragment_ExternalVideo_Fragment = {
  __typename?: 'ExternalVideo';
} & Pick<
  Types.ExternalVideo,
  'mediaContentType' | 'id' | 'embeddedUrl' | 'host'
>;

export type MediaFileFragment_MediaImage_Fragment = {
  __typename?: 'MediaImage';
} & Pick<Types.MediaImage, 'mediaContentType'> & {
    image?: Types.Maybe<
      {__typename?: 'Image'} & Pick<
        Types.Image,
        'id' | 'url' | 'altText' | 'width' | 'height'
      >
    >;
  };

export type MediaFileFragment_Model3d_Fragment = {
  __typename?: 'Model3d';
} & Pick<Types.Model3d, 'mediaContentType' | 'id' | 'alt'> & {
    previewImage?: Types.Maybe<
      {__typename?: 'Image'} & Pick<Types.Image, 'url'>
    >;
    sources: Array<
      {__typename?: 'Model3dSource'} & Pick<Types.Model3dSource, 'url'>
    >;
  };

export type MediaFileFragment_Video_Fragment = {__typename?: 'Video'} & Pick<
  Types.Video,
  'mediaContentType' | 'id'
> & {
    previewImage?: Types.Maybe<
      {__typename?: 'Image'} & Pick<Types.Image, 'url'>
    >;
    sources: Array<
      {__typename?: 'VideoSource'} & Pick<Types.VideoSource, 'mimeType' | 'url'>
    >;
  };

export type MediaFileFragmentFragment =
  | MediaFileFragment_ExternalVideo_Fragment
  | MediaFileFragment_MediaImage_Fragment
  | MediaFileFragment_Model3d_Fragment
  | MediaFileFragment_Video_Fragment;

/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type MediaFileFragment_ExternalVideo_Fragment = {
  __typename?: 'ExternalVideo';
  mediaContentType: Types.MediaContentType;
  id: string;
  embeddedUrl: any;
  host: Types.MediaHost;
};

export type MediaFileFragment_MediaImage_Fragment = {
  __typename?: 'MediaImage';
  mediaContentType: Types.MediaContentType;
  image?: {
    __typename?: 'Image';
    id?: string | null;
    url: any;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

export type MediaFileFragment_Model3d_Fragment = {
  __typename?: 'Model3d';
  mediaContentType: Types.MediaContentType;
  id: string;
  alt?: string | null;
  previewImage?: {__typename?: 'Image'; url: any} | null;
  sources: Array<{__typename?: 'Model3dSource'; url: string}>;
};

export type MediaFileFragment_Video_Fragment = {
  __typename?: 'Video';
  mediaContentType: Types.MediaContentType;
  id: string;
  previewImage?: {__typename?: 'Image'; url: any} | null;
  sources: Array<{__typename?: 'VideoSource'; mimeType: string; url: string}>;
};

export type MediaFileFragmentFragment =
  | MediaFileFragment_ExternalVideo_Fragment
  | MediaFileFragment_MediaImage_Fragment
  | MediaFileFragment_Model3d_Fragment
  | MediaFileFragment_Video_Fragment;

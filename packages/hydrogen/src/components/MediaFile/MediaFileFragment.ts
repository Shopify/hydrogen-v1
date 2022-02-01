import * as Types from '../../graphql/types/types';

import {ImageFragmentFragment} from '../Image/ImageFragment';
import {VideoFragmentFragment} from '../Video/VideoFragment';
import {ExternalVideoFragmentFragment} from '../ExternalVideo/ExternalVideoFragment';
import {Model3DFragmentFragment} from '../ModelViewer/Model3DFragment';
export type MediaFileFragment_ExternalVideo_Fragment = {
  __typename?: 'ExternalVideo';
} & Pick<Types.ExternalVideo, 'mediaContentType'> &
  ExternalVideoFragmentFragment;

export type MediaFileFragment_MediaImage_Fragment = {
  __typename?: 'MediaImage';
} & Pick<Types.MediaImage, 'mediaContentType'> & {
    image?: Types.Maybe<{__typename?: 'Image'} & ImageFragmentFragment>;
  };

export type MediaFileFragment_Model3d_Fragment = {
  __typename?: 'Model3d';
} & Pick<Types.Model3d, 'mediaContentType'> &
  Model3DFragmentFragment;

export type MediaFileFragment_Video_Fragment = {__typename?: 'Video'} & Pick<
  Types.Video,
  'mediaContentType'
> &
  VideoFragmentFragment;

export type MediaFileFragmentFragment =
  | MediaFileFragment_ExternalVideo_Fragment
  | MediaFileFragment_MediaImage_Fragment
  | MediaFileFragment_Model3d_Fragment
  | MediaFileFragment_Video_Fragment;

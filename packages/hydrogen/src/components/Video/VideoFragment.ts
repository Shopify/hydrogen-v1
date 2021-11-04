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

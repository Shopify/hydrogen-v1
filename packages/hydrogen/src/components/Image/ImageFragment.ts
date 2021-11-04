import * as Types from '../../graphql/types/types';

export type ImageFragmentFragment = {__typename?: 'Image'} & Pick<
  Types.Image,
  'id' | 'url' | 'altText' | 'width' | 'height'
>;

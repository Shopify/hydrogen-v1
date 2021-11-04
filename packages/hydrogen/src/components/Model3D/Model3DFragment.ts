import * as Types from '../../graphql/types/types';

export type Model3DFragmentFragment = {__typename?: 'Model3d'} & Pick<
  Types.Model3d,
  'id' | 'alt' | 'mediaContentType'
> & {
    previewImage?: Types.Maybe<
      {__typename?: 'Image'} & Pick<Types.Image, 'url'>
    >;
    sources: Array<
      {__typename?: 'Model3dSource'} & Pick<Types.Model3dSource, 'url'>
    >;
  };

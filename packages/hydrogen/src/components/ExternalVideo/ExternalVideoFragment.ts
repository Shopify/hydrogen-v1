import * as Types from '../../graphql/types/types';

export type ExternalVideoFragmentFragment = {
  __typename?: 'ExternalVideo';
} & Pick<Types.ExternalVideo, 'id' | 'embedUrl' | 'host'>;

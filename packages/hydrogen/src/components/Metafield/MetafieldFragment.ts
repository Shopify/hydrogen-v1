import * as Types from '../../graphql/types/types';

export type MetafieldFragmentFragment = {__typename?: 'Metafield'} & Pick<
  Types.Metafield,
  | 'id'
  | 'type'
  | 'namespace'
  | 'key'
  | 'value'
  | 'createdAt'
  | 'updatedAt'
  | 'description'
>;

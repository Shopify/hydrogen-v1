import * as Types from '../../graphql/types/types';

export type MoneyFragmentFragment = {__typename?: 'MoneyV2'} & Pick<
  Types.MoneyV2,
  'currencyCode' | 'amount'
>;

import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
}>;

export type CartQueryQuery = {__typename?: 'QueryRoot'} & {
  cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
};

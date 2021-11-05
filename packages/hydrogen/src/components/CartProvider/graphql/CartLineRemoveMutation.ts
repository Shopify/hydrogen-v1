import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartLineRemoveMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID'];
  lines: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
  country?: Types.Maybe<Types.CountryCode>;
}>;

export type CartLineRemoveMutation = {__typename?: 'Mutation'} & {
  cartLinesRemove?: Types.Maybe<
    {__typename?: 'CartLinesRemovePayload'} & {
      cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
    }
  >;
};

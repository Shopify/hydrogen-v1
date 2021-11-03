import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartLineAddMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID'];
  lines: Array<Types.CartLineInput> | Types.CartLineInput;
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
  country?: Types.Maybe<Types.CountryCode>;
}>;

export type CartLineAddMutation = {__typename?: 'Mutation'} & {
  cartLinesAdd?: Types.Maybe<
    {__typename?: 'CartLinesAddPayload'} & {
      cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
    }
  >;
};

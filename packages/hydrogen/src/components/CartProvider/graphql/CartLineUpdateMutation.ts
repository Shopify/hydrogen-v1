import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartLineUpdateMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID'];
  lines: Array<Types.CartLineUpdateInput> | Types.CartLineUpdateInput;
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
}>;

export type CartLineUpdateMutation = {__typename?: 'Mutation'} & {
  cartLinesUpdate?: Types.Maybe<
    {__typename?: 'CartLinesUpdatePayload'} & {
      cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
    }
  >;
};

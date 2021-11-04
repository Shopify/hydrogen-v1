import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartBuyerIdentityUpdateMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID'];
  buyerIdentity: Types.CartBuyerIdentityInput;
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
}>;

export type CartBuyerIdentityUpdateMutation = {__typename?: 'Mutation'} & {
  cartBuyerIdentityUpdate?: Types.Maybe<
    {__typename?: 'CartBuyerIdentityUpdatePayload'} & {
      cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
    }
  >;
};

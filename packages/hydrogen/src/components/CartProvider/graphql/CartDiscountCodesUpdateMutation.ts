import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartDiscountCodesUpdateMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID'];
  discountCodes?: Types.Maybe<
    Array<Types.Scalars['String']> | Types.Scalars['String']
  >;
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
}>;

export type CartDiscountCodesUpdateMutation = {__typename?: 'Mutation'} & {
  cartDiscountCodesUpdate?: Types.Maybe<
    {__typename?: 'CartDiscountCodesUpdatePayload'} & {
      cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
    }
  >;
};

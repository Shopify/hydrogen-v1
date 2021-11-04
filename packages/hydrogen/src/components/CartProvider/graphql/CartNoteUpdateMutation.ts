import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartNoteUpdateMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID'];
  note?: Types.Maybe<Types.Scalars['String']>;
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
}>;

export type CartNoteUpdateMutation = {__typename?: 'Mutation'} & {
  cartNoteUpdate?: Types.Maybe<
    {__typename?: 'CartNoteUpdatePayload'} & {
      cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
    }
  >;
};

import * as Types from '../../../graphql/types/types';

import {CartFragmentFragment} from './CartFragment';
export type CartAttributesUpdateMutationVariables = Types.Exact<{
  attributes: Array<Types.AttributeInput> | Types.AttributeInput;
  cartId: Types.Scalars['ID'];
  numCartLines?: Types.Maybe<Types.Scalars['Int']>;
  country?: Types.Maybe<Types.CountryCode>;
}>;

export type CartAttributesUpdateMutation = {__typename?: 'Mutation'} & {
  cartAttributesUpdate?: Types.Maybe<
    {__typename?: 'CartAttributesUpdatePayload'} & {
      cart?: Types.Maybe<{__typename?: 'Cart'} & CartFragmentFragment>;
    }
  >;
};

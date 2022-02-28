/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../../graphql/types/types';

export type CartBuyerIdentityUpdateMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID'];
  buyerIdentity: Types.CartBuyerIdentityInput;
  numCartLines?: Types.InputMaybe<Types.Scalars['Int']>;
  country?: Types.InputMaybe<Types.CountryCode>;
}>;

export type CartBuyerIdentityUpdateMutation = {
  __typename?: 'Mutation';
  cartBuyerIdentityUpdate?: {
    __typename?: 'CartBuyerIdentityUpdatePayload';
    cart?: {
      __typename?: 'Cart';
      id: string;
      checkoutUrl: any;
      note?: string | null;
      buyerIdentity: {
        __typename?: 'CartBuyerIdentity';
        countryCode?: Types.CountryCode | null;
        email?: string | null;
        phone?: string | null;
        customer?: {
          __typename?: 'Customer';
          id: string;
          email?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          displayName: string;
        } | null;
      };
      lines: {
        __typename?: 'CartLineConnection';
        edges: Array<{
          __typename?: 'CartLineEdge';
          node: {
            __typename?: 'CartLine';
            id: string;
            quantity: number;
            attributes: Array<{
              __typename?: 'Attribute';
              key: string;
              value?: string | null;
            }>;
            merchandise: {
              __typename?: 'ProductVariant';
              id: string;
              availableForSale: boolean;
              requiresShipping: boolean;
              title: string;
              compareAtPriceV2?: {
                __typename?: 'MoneyV2';
                currencyCode: Types.CurrencyCode;
                amount: any;
              } | null;
              priceV2: {
                __typename?: 'MoneyV2';
                currencyCode: Types.CurrencyCode;
                amount: any;
              };
              image?: {
                __typename?: 'Image';
                id?: string | null;
                url: any;
                altText?: string | null;
                width?: number | null;
                height?: number | null;
              } | null;
              product: {__typename?: 'Product'; handle: string; title: string};
              selectedOptions: Array<{
                __typename?: 'SelectedOption';
                name: string;
                value: string;
              }>;
            };
          };
        }>;
      };
      estimatedCost: {
        __typename?: 'CartEstimatedCost';
        subtotalAmount: {
          __typename?: 'MoneyV2';
          currencyCode: Types.CurrencyCode;
          amount: any;
        };
        totalAmount: {
          __typename?: 'MoneyV2';
          currencyCode: Types.CurrencyCode;
          amount: any;
        };
        totalDutyAmount?: {
          __typename?: 'MoneyV2';
          currencyCode: Types.CurrencyCode;
          amount: any;
        } | null;
        totalTaxAmount?: {
          __typename?: 'MoneyV2';
          currencyCode: Types.CurrencyCode;
          amount: any;
        } | null;
      };
      attributes: Array<{
        __typename?: 'Attribute';
        key: string;
        value?: string | null;
      }>;
      discountCodes: Array<{__typename?: 'CartDiscountCode'; code: string}>;
    } | null;
  } | null;
};

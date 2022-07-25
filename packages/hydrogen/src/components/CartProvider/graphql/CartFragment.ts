/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../../storefront-api-types.js';

export type CartFragmentFragment = {__typename?: 'Cart'} & Pick<
  Types.Cart,
  'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
    buyerIdentity: {__typename?: 'CartBuyerIdentity'} & Pick<
      Types.CartBuyerIdentity,
      'countryCode' | 'email' | 'phone'
    > & {
        customer?: Types.Maybe<
          {__typename?: 'Customer'} & Pick<
            Types.Customer,
            'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
          >
        >;
      };
    lines: {__typename?: 'CartLineConnection'} & {
      edges: Array<
        {__typename?: 'CartLineEdge'} & {
          node: {__typename?: 'CartLine'} & Pick<
            Types.CartLine,
            'id' | 'quantity'
          > & {
              attributes: Array<
                {__typename?: 'Attribute'} & Pick<
                  Types.Attribute,
                  'key' | 'value'
                >
              >;
              cost: {__typename?: 'CartLineCost'} & {
                totalAmount: {__typename?: 'MoneyV2'} & Pick<
                  Types.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                compareAtAmountPerQuantity?: Types.Maybe<
                  {__typename?: 'MoneyV2'} & Pick<
                    Types.MoneyV2,
                    'amount' | 'currencyCode'
                  >
                >;
              };
              merchandise: {__typename?: 'ProductVariant'} & Pick<
                Types.ProductVariant,
                'id' | 'availableForSale' | 'requiresShipping' | 'title'
              > & {
                  compareAtPriceV2?: Types.Maybe<
                    {__typename?: 'MoneyV2'} & Pick<
                      Types.MoneyV2,
                      'currencyCode' | 'amount'
                    >
                  >;
                  priceV2: {__typename?: 'MoneyV2'} & Pick<
                    Types.MoneyV2,
                    'currencyCode' | 'amount'
                  >;
                  image?: Types.Maybe<
                    {__typename?: 'Image'} & Pick<
                      Types.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  product: {__typename?: 'Product'} & Pick<
                    Types.Product,
                    'handle' | 'title'
                  >;
                  selectedOptions: Array<
                    {__typename?: 'SelectedOption'} & Pick<
                      Types.SelectedOption,
                      'name' | 'value'
                    >
                  >;
                };
            };
        }
      >;
    };
    cost: {__typename?: 'CartCost'} & {
      subtotalAmount: {__typename?: 'MoneyV2'} & Pick<
        Types.MoneyV2,
        'currencyCode' | 'amount'
      >;
      totalAmount: {__typename?: 'MoneyV2'} & Pick<
        Types.MoneyV2,
        'currencyCode' | 'amount'
      >;
      totalDutyAmount?: Types.Maybe<
        {__typename?: 'MoneyV2'} & Pick<
          Types.MoneyV2,
          'currencyCode' | 'amount'
        >
      >;
      totalTaxAmount?: Types.Maybe<
        {__typename?: 'MoneyV2'} & Pick<
          Types.MoneyV2,
          'currencyCode' | 'amount'
        >
      >;
    };
    attributes: Array<
      {__typename?: 'Attribute'} & Pick<Types.Attribute, 'key' | 'value'>
    >;
    discountCodes: Array<
      {__typename?: 'CartDiscountCode'} & Pick<
        Types.CartDiscountCode,
        'code' | 'applicable'
      >
    >;
  };

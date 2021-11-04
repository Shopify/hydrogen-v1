import * as Types from '../../../graphql/types/types';

import {MoneyFragmentFragment} from '../../Money/MoneyFragment';
import {ImageFragmentFragment} from '../../Image/ImageFragment';
export type CartFragmentFragment = {__typename?: 'Cart'} & Pick<
  Types.Cart,
  'id' | 'checkoutUrl' | 'note'
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
              merchandise: {__typename?: 'ProductVariant'} & Pick<
                Types.ProductVariant,
                'id' | 'availableForSale' | 'requiresShipping' | 'title'
              > & {
                  compareAtPriceV2?: Types.Maybe<
                    {__typename?: 'MoneyV2'} & MoneyFragmentFragment
                  >;
                  priceV2: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
                  image?: Types.Maybe<
                    {__typename?: 'Image'} & ImageFragmentFragment
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
    estimatedCost: {__typename?: 'CartEstimatedCost'} & {
      subtotalAmount: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
      totalAmount: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
      totalDutyAmount?: Types.Maybe<
        {__typename?: 'MoneyV2'} & MoneyFragmentFragment
      >;
      totalTaxAmount?: Types.Maybe<
        {__typename?: 'MoneyV2'} & MoneyFragmentFragment
      >;
    };
    attributes: Array<
      {__typename?: 'Attribute'} & Pick<Types.Attribute, 'key' | 'value'>
    >;
    discountCodes: Array<
      {__typename?: 'CartDiscountCode'} & Pick<Types.CartDiscountCode, 'code'>
    >;
  };

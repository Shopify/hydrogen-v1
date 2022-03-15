/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../storefront-api-types';

export type VariantFragmentFragment = {__typename?: 'ProductVariant'} & Pick<
  Types.ProductVariant,
  'id' | 'title' | 'availableForSale'
> & {
    image?: Types.Maybe<
      {__typename?: 'Image'} & Pick<
        Types.Image,
        'id' | 'url' | 'altText' | 'width' | 'height'
      >
    >;
    priceV2: {__typename?: 'MoneyV2'} & Pick<
      Types.MoneyV2,
      'currencyCode' | 'amount'
    >;
    compareAtPriceV2?: Types.Maybe<
      {__typename?: 'MoneyV2'} & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>
    >;
    selectedOptions: Array<
      {__typename?: 'SelectedOption'} & Pick<
        Types.SelectedOption,
        'name' | 'value'
      >
    >;
    metafields: {__typename?: 'MetafieldConnection'} & {
      edges: Array<
        {__typename?: 'MetafieldEdge'} & {
          node: {__typename?: 'Metafield'} & Pick<
            Types.Metafield,
            | 'id'
            | 'type'
            | 'namespace'
            | 'key'
            | 'value'
            | 'createdAt'
            | 'updatedAt'
            | 'description'
          > & {
              reference?: Types.Maybe<
                | ({__typename: 'MediaImage'} & Pick<
                    Types.MediaImage,
                    'id' | 'mediaContentType'
                  > & {
                      image?: Types.Maybe<
                        {__typename?: 'Image'} & Pick<
                          Types.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                | {__typename: 'Page'}
                | {__typename: 'Product'}
                | {__typename: 'ProductVariant'}
              >;
            };
        }
      >;
    };
    sellingPlanAllocations: {__typename?: 'SellingPlanAllocationConnection'} & {
      edges: Array<
        {__typename?: 'SellingPlanAllocationEdge'} & {
          node: {__typename?: 'SellingPlanAllocation'} & {
            priceAdjustments: Array<
              {__typename?: 'SellingPlanAllocationPriceAdjustment'} & {
                compareAtPrice: {__typename?: 'MoneyV2'} & Pick<
                  Types.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                perDeliveryPrice: {__typename?: 'MoneyV2'} & Pick<
                  Types.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                price: {__typename?: 'MoneyV2'} & Pick<
                  Types.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                unitPrice?: Types.Maybe<
                  {__typename?: 'MoneyV2'} & Pick<
                    Types.MoneyV2,
                    'currencyCode' | 'amount'
                  >
                >;
              }
            >;
            sellingPlan: {__typename?: 'SellingPlan'} & Pick<
              Types.SellingPlan,
              'id' | 'description' | 'name' | 'recurringDeliveries'
            > & {
                options: Array<
                  {__typename?: 'SellingPlanOption'} & Pick<
                    Types.SellingPlanOption,
                    'name' | 'value'
                  >
                >;
                priceAdjustments: Array<
                  {__typename?: 'SellingPlanPriceAdjustment'} & Pick<
                    Types.SellingPlanPriceAdjustment,
                    'orderCount'
                  > & {
                      adjustmentValue:
                        | ({
                            __typename?: 'SellingPlanFixedAmountPriceAdjustment';
                          } & {
                            adjustmentAmount: {__typename?: 'MoneyV2'} & Pick<
                              Types.MoneyV2,
                              'currencyCode' | 'amount'
                            >;
                          })
                        | ({__typename?: 'SellingPlanFixedPriceAdjustment'} & {
                            price: {__typename?: 'MoneyV2'} & Pick<
                              Types.MoneyV2,
                              'currencyCode' | 'amount'
                            >;
                          })
                        | ({
                            __typename?: 'SellingPlanPercentagePriceAdjustment';
                          } & Pick<
                            Types.SellingPlanPercentagePriceAdjustment,
                            'adjustmentPercentage'
                          >);
                    }
                >;
              };
          };
        }
      >;
    };
    unitPriceMeasurement?: Types.Maybe<
      {__typename?: 'UnitPriceMeasurement'} & Pick<
        Types.UnitPriceMeasurement,
        | 'measuredType'
        | 'quantityUnit'
        | 'quantityValue'
        | 'referenceUnit'
        | 'referenceValue'
      >
    >;
    unitPrice?: Types.Maybe<
      {__typename?: 'MoneyV2'} & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };

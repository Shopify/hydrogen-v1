/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../storefront-api-types';

export type SellingPlanGroupsFragmentFragment = {
  __typename?: 'SellingPlanGroup';
} & Pick<Types.SellingPlanGroup, 'appName' | 'name'> & {
    sellingPlans: {__typename?: 'SellingPlanConnection'} & {
      edges: Array<
        {__typename?: 'SellingPlanEdge'} & {
          node: {__typename?: 'SellingPlan'} & Pick<
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
        }
      >;
    };
    options: Array<
      {__typename?: 'SellingPlanGroupOption'} & Pick<
        Types.SellingPlanGroupOption,
        'name' | 'values'
      >
    >;
  };

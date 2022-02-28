/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type SellingPlanGroupsFragmentFragment = {
  __typename?: 'SellingPlanGroup';
  appName?: string | null;
  name: string;
  sellingPlans: {
    __typename?: 'SellingPlanConnection';
    edges: Array<{
      __typename?: 'SellingPlanEdge';
      node: {
        __typename?: 'SellingPlan';
        id: string;
        description?: string | null;
        name: string;
        recurringDeliveries: boolean;
        options: Array<{
          __typename?: 'SellingPlanOption';
          name?: string | null;
          value?: string | null;
        }>;
        priceAdjustments: Array<{
          __typename?: 'SellingPlanPriceAdjustment';
          orderCount?: number | null;
          adjustmentValue:
            | {
                __typename?: 'SellingPlanFixedAmountPriceAdjustment';
                adjustmentAmount: {
                  __typename?: 'MoneyV2';
                  currencyCode: Types.CurrencyCode;
                  amount: any;
                };
              }
            | {
                __typename?: 'SellingPlanFixedPriceAdjustment';
                price: {
                  __typename?: 'MoneyV2';
                  currencyCode: Types.CurrencyCode;
                  amount: any;
                };
              }
            | {
                __typename?: 'SellingPlanPercentagePriceAdjustment';
                adjustmentPercentage: number;
              };
        }>;
      };
    }>;
  };
  options: Array<{
    __typename?: 'SellingPlanGroupOption';
    name: string;
    values: Array<string>;
  }>;
};

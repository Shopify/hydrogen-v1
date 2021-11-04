import * as Types from '../../graphql/types/types';

import {MoneyFragmentFragment} from '../../components/Money/MoneyFragment';
export type SellingPlanFragmentFragment = {__typename?: 'SellingPlan'} & Pick<
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
            | ({__typename?: 'SellingPlanFixedAmountPriceAdjustment'} & {
                adjustmentAmount: {
                  __typename?: 'MoneyV2';
                } & MoneyFragmentFragment;
              })
            | ({__typename?: 'SellingPlanFixedPriceAdjustment'} & {
                price: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
              })
            | ({__typename?: 'SellingPlanPercentagePriceAdjustment'} & Pick<
                Types.SellingPlanPercentagePriceAdjustment,
                'adjustmentPercentage'
              >);
        }
    >;
  };

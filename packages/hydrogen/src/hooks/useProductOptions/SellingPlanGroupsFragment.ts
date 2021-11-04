import * as Types from '../../graphql/types/types';

import {SellingPlanFragmentFragment} from './SellingPlanFragment';
export type SellingPlanGroupsFragmentFragment = {
  __typename?: 'SellingPlanGroup';
} & Pick<Types.SellingPlanGroup, 'appName' | 'name'> & {
    sellingPlans: {__typename?: 'SellingPlanConnection'} & {
      edges: Array<
        {__typename?: 'SellingPlanEdge'} & {
          node: {__typename?: 'SellingPlan'} & SellingPlanFragmentFragment;
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

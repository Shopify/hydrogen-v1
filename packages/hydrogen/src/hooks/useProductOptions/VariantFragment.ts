import * as Types from '../../graphql/types/types';

import {ImageFragmentFragment} from '../../components/Image/ImageFragment';
import {UnitPriceFragmentFragment} from '../../components/UnitPrice/UnitPriceFragment';
import {MoneyFragmentFragment} from '../../components/Money/MoneyFragment';
import {MetafieldFragmentFragment} from '../../components/Metafield/MetafieldFragment';
import {SellingPlanFragmentFragment} from './SellingPlanFragment';
export type VariantFragmentFragment = {__typename?: 'ProductVariant'} & Pick<
  Types.ProductVariant,
  'id' | 'title' | 'availableForSale'
> & {
    image?: Types.Maybe<{__typename?: 'Image'} & ImageFragmentFragment>;
    priceV2: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
    compareAtPriceV2?: Types.Maybe<
      {__typename?: 'MoneyV2'} & MoneyFragmentFragment
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
          node: {__typename?: 'Metafield'} & MetafieldFragmentFragment;
        }
      >;
    };
    sellingPlanAllocations: {__typename?: 'SellingPlanAllocationConnection'} & {
      edges: Array<
        {__typename?: 'SellingPlanAllocationEdge'} & {
          node: {__typename?: 'SellingPlanAllocation'} & {
            priceAdjustments: Array<
              {__typename?: 'SellingPlanAllocationPriceAdjustment'} & {
                compareAtPrice: {
                  __typename?: 'MoneyV2';
                } & MoneyFragmentFragment;
                perDeliveryPrice: {
                  __typename?: 'MoneyV2';
                } & MoneyFragmentFragment;
                price: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
                unitPrice?: Types.Maybe<
                  {__typename?: 'MoneyV2'} & MoneyFragmentFragment
                >;
              }
            >;
            sellingPlan: {
              __typename?: 'SellingPlan';
            } & SellingPlanFragmentFragment;
          };
        }
      >;
    };
  } & UnitPriceFragmentFragment;

import * as Types from '../../graphql/types/types';

import {MoneyFragmentFragment} from '../Money/MoneyFragment';
export type UnitPriceFragmentFragment = {__typename?: 'ProductVariant'} & {
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
  unitPrice?: Types.Maybe<{__typename?: 'MoneyV2'} & MoneyFragmentFragment>;
};

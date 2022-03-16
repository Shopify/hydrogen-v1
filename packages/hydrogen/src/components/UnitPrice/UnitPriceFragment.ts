/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../storefront-api-types';

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
  unitPrice?: Types.Maybe<
    {__typename?: 'MoneyV2'} & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>
  >;
};

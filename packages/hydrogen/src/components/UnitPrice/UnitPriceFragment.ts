/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type UnitPriceFragmentFragment = {
  __typename?: 'ProductVariant';
  unitPriceMeasurement?: {
    __typename?: 'UnitPriceMeasurement';
    measuredType?: Types.UnitPriceMeasurementMeasuredType | null;
    quantityUnit?: Types.UnitPriceMeasurementMeasuredUnit | null;
    quantityValue: number;
    referenceUnit?: Types.UnitPriceMeasurementMeasuredUnit | null;
    referenceValue: number;
  } | null;
  unitPrice?: {
    __typename?: 'MoneyV2';
    currencyCode: Types.CurrencyCode;
    amount: any;
  } | null;
};

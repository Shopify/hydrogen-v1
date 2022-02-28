/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type LocalizationQueryVariables = Types.Exact<{[key: string]: never}>;

export type LocalizationQuery = {
  __typename?: 'QueryRoot';
  localization: {
    __typename?: 'Localization';
    country: {
      __typename?: 'Country';
      isoCode: Types.CountryCode;
      name: string;
      currency: {__typename?: 'Currency'; isoCode: Types.CurrencyCode};
    };
    availableCountries: Array<{
      __typename?: 'Country';
      isoCode: Types.CountryCode;
      name: string;
      currency: {__typename?: 'Currency'; isoCode: Types.CurrencyCode};
    }>;
  };
};

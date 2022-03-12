/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../storefront-api-types';

export type LocalizationQueryVariables = Types.Exact<{[key: string]: never}>;

export type LocalizationQuery = {__typename?: 'QueryRoot'} & {
  localization: {__typename?: 'Localization'} & {
    country: {__typename?: 'Country'} & Pick<
      Types.Country,
      'isoCode' | 'name'
    > & {currency: {__typename?: 'Currency'} & Pick<Types.Currency, 'isoCode'>};
    availableCountries: Array<
      {__typename?: 'Country'} & Pick<Types.Country, 'isoCode' | 'name'> & {
          currency: {__typename?: 'Currency'} & Pick<Types.Currency, 'isoCode'>;
        }
    >;
  };
};

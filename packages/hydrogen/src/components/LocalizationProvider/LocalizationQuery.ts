import * as Types from '../../graphql/types/types';

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

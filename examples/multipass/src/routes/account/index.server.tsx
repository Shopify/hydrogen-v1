import React from 'react';
import {
  CacheNone,
  flattenConnection,
  gql,
  useSession,
  useLocalization,
  useShopQuery,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import {AccountDetails, LogoutButton} from '~/components/client';
import type {
  CollectionConnection,
  Customer,
  ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';

/*
  User authenticated page.
*/
export default function Account({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery<{
    customer: Customer;
    featuredCollections: CollectionConnection;
    featuredProducts: ProductConnection;
  }>({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const {customer} = data;

  if (!customer) return response.redirect('/account/login');

  const orders = flattenConnection(customer?.orders) || [];

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div>
      <LogoutButton>Sign out</LogoutButton>
      <h1>{heading}</h1>

      <p>Orders: {orders.length}</p>
      <AccountDetails
        firstName={customer.firstName as string}
        lastName={customer.lastName as string}
        phone={customer.phone as string}
        email={customer.email as string}
      />
    </div>
  );
}

const CUSTOMER_QUERY = gql`
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      defaultAddress {
        id
        formatted
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

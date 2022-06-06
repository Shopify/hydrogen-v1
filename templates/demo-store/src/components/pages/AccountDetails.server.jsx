import {
  Seo,
  useShopQuery,
  useShop,
  useSession,
  useServerProps,
  NoStore,
  flattenConnection,
  gql,
} from '@shopify/hydrogen';

import {useCallback} from 'react';

import {
  FeaturedCollections,
  ProductSwimlane,
  Locations,
} from '~/components/sections';

import Layout from '../layouts/DefaultLayout.server';
import OrderHistory from '../sections/OrderHistory.client';
import AddressBook from '../sections/AddressBook.client';

import {LOCATION_CARD_FIELDS, PRODUCT_CARD_FIELDS} from '~/lib/fragments';

export default function AccountDetails({customerAccessToken}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
      withAddressDetails: !!editingAddress,
    },
    preload: true,
    cache: NoStore(),
  });

  const customer = data && data.customer;

  const orders =
    customer?.orders?.edges.length > 0
      ? flattenConnection(customer.orders)
      : [];

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  const {featuredCollections, featuredProducts, locations} = data;

  const {setServerProps} = useServerProps();

  const startEditing = useCallback(
    () => setServerProps('editingAccount', true),
    [setServerProps],
  );

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Account details'}} />
      {orders && <OrderHistory orders={orders} heading={heading} />}

      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead">Address Book</h3>
        <AddressBook
          addresses={customer.addresses}
          defaultAddress={customer.defaultAddress}
        />
      </div>
      <FeaturedCollections
        title="Popular Collections"
        data={featuredCollections.nodes}
      />
      <ProductSwimlane data={featuredProducts.nodes} />
      <Locations data={locations.nodes} />
    </Layout>
  );
}

const QUERY = gql`
  ${LOCATION_CARD_FIELDS}
  ${PRODUCT_CARD_FIELDS}
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
    $withAddressDetails: Boolean!
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      phone
      defaultAddress {
        id
        formatted
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName @include(if: $withAddressDetails)
            lastName @include(if: $withAddressDetails)
            company @include(if: $withAddressDetails)
            address1 @include(if: $withAddressDetails)
            address2 @include(if: $withAddressDetails)
            country @include(if: $withAddressDetails)
            province @include(if: $withAddressDetails)
            city @include(if: $withAddressDetails)
            phone @include(if: $withAddressDetails)
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 30) {
              edges {
                node {
                  variant {
                    image {
                      url
                      height
                      width
                      altText
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
    locations: contentEntries(first: 3, type: "stores") {
      nodes {
        ...LocationCardFields
      }
    }
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCardFields
      }
    }
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;

const MUTATION = gql`
  mutation customerUpdate(
    $customer: CustomerUpdateInput!
    $customerAccessToken: String!
  ) {
    customerUpdate(
      customer: $customer
      customerAccessToken: $customerAccessToken
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

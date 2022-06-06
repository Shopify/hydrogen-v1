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
        <h2 className="font-bold text-lead">Account Details</h2>
        <div className="lg:p-8 p-6 border border-gray-200 rounded">
          <div className="flex">
            <h3 className="font-bold text-base flex-1">Profile & Security</h3>
            <button className="underline text-sm font-normal">Edit</button>
          </div>
          <div className="mt-4 text-sm text-gray-500">Name</div>
          <p className="mt-1">
            {customer.firstName || customer.lastName
              ? (customer.firstName && customer.firstName + ' ') +
                customer.lastName
              : 'Add name'}{' '}
          </p>

          <div className="mt-4 text-sm text-gray-500">Contact</div>
          <p className="mt-1">{customer.phone ?? 'Add mobile'}</p>

          <div className="mt-4 text-sm text-gray-500">Email address</div>
          <p className="mt-1">{customer.email}</p>

          <div className="mt-4 text-sm text-gray-500">Password</div>
          <p className="mt-1">**************</p>
        </div>
      </div>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead">Address Book</h3>
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
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
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

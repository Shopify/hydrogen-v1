import {
  Seo,
  useShopQuery,
  useShop,
  useSession,
  NoStore,
  flattenConnection,
  gql,
} from '@shopify/hydrogen';

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
    ? `Welcome${customer.firstName ? `, ${customer.firstName}` : ``}`
    : 'Account Details';

  const {featuredCollections, featuredProducts, locations} = data;

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Account details'}} />
      <OrderHistory orders={orders} heading={heading} />
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

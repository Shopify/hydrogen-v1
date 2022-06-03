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
  PageHeader,
  ProductSwimlane,
  Locations,
} from '~/components/sections';
import {Text, Button} from '~/components/elements';

import Layout from '../layouts/DefaultLayout.server';
import LogoutButton from '../elements/LogoutButton.client';
import MoneyPrice from '../blocks/MoneyPrice.client';
import OrderCard from '../blocks/OrderCard.client';

import {LOCATION_CARD_FIELDS, PRODUCT_CARD_FIELDS} from '~/lib/fragments';

function EmptyOrders(props) {
  const {heading} = props;
  return (
    <PageHeader heading={heading}>
      <LogoutButton className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800">
        Logout
      </LogoutButton>
      <Text width="narrow" as="p">
        You haven't made any orders yet.
      </Text>
      <Button width="auto" variant="secondary" to={'/'}>
        Start shopping
      </Button>
    </PageHeader>
  );
}

function OrderHistory(props) {
  const {orders, heading} = props;
  return (
    <div>
      <PageHeader heading={heading}>
        <LogoutButton className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800">
          Logout
        </LogoutButton>
      </PageHeader>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h2 className="font-bold text-lead">Order History</h2>
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {orders.map((order) => (
            <OrderCard order={order} />
          ))}
        </ul>
      </div>
    </div>
  );
}

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
      {orders.length ? (
        <OrderHistory orders={orders} heading={heading} />
      ) : (
        <EmptyOrders heading={heading} />
      )}
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

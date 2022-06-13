import {
  Seo,
  useShopQuery,
  useShop,
  useSession,
  NoStore,
  gql,
  flattenConnection,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';
import {PageHeader, Text, Button, LogoutButton} from '~/components/elements';
import {OrderCard} from '~/components/blocks';
import {Layout} from '~/components/layouts';

import {FeaturedCollections, ProductSwimlane} from '~/components/sections';

export function AccountDetails({customerAccessToken}) {
  if (!customerAccessToken) return null;
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();
  const {data} = useShopQuery({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    preload: true,
    cache: NoStore(),
  });

  const customer = data && data.customer;

  const orders = flattenConnection(customer?.orders);

  const heading = customer
    ? `Welcome${customer.firstName ? `, ${customer.firstName}` : ``}`
    : 'Account Details';

  const {featuredCollections, featuredProducts} = data;

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
    </Layout>
  );
}

/* TODO: We should import any hardcoded langauge from a central JSON file to make i18n and customization easier. */
function EmptyOrders({heading}) {
  return (
    <PageHeader heading={heading}>
      <LogoutButton className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800">
        Logout
      </LogoutButton>
      <Text width="narrow" as="p">
        You haven&rsquo;t made any orders yet.
      </Text>
      <Button width="auto" variant="secondary" to={'/'}>
        Start shopping
      </Button>
    </PageHeader>
  );
}

function OrderHistory({orders, heading}) {
  return (
    <div>
      <PageHeader heading={heading}>
        <LogoutButton className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800">
          Logout
        </LogoutButton>
      </PageHeader>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h2 className="font-bold text-lead">Order History</h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => (
            <OrderCard order={order} key={order.id} />
          ))}
        </ul>
      </div>
    </div>
  );
}

const CUSTOMER_QUERY = gql`
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
        nodes {
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

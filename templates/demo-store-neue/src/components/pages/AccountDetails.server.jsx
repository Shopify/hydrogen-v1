import {
  Seo,
  useShopQuery,
  NoStore,
  flattenConnection,
  gql,
} from '@shopify/hydrogen';

import {PageHeader} from '~/components/sections';
import {Text, Button} from '~/components/elements';

import Layout from '../layouts/DefaultLayout.server';
import LogoutButton from '../elements/LogoutButton.client';
import MoneyPrice from '../blocks/MoneyPrice.client';

function EmptyOrders(props) {
  const {heading} = props;
  return (
    <PageHeader heading={heading}>
      <LogoutButton className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
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
  const {orders} = props;
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-6 mb-4">
      <h2>Order History</h2>
      <table className="min-w-full table-fixed text-sm text-left mt-6">
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Payment Status</th>
            <th>Fulfillment Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.orderNumber}</td>
              <td>{new Date(order.processedAt).toDateString()}</td>
              <td>{order.financialStatus}</td>
              <td>{order.fulfillmentStatus}</td>
              <td>
                <MoneyPrice money={order.currentTotalPrice} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AccountDetails({customerAccessToken}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      customerAccessToken,
    },
    cache: NoStore(),
  });

  const customer = data && data.customer;

  const orders =
    customer?.orders?.edges.length > 0
      ? flattenConnection(customer.orders)
      : [];

  const heading = customer
    ? `Welcome, ${customer.firstName || customer.email}`
    : 'Account Details';

  const {featuredCollections, featuredProducts, locations} = data;

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Account details'}} />
      {orders.length ? (
        <OrderHistory orders={orders} />
      ) : (
        <EmptyOrders heading={heading} />
      )}
    </Layout>
  );
}

const QUERY = gql`
  query CustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      email
      orders(first: 250) {
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
          }
        }
      }
    }
  }
`;

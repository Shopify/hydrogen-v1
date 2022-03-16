import {useCookies, useShopQuery, flattenConnection} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/Layout.server';
import MoneyPrice from '../../components/MoneyPrice.client';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants/cookies';

export default function Account({response}) {
  const cookies = useCookies();

  const customerAccessToken = cookies.get(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME);
  if (!customerAccessToken) {
    response.redirect('/account/login');
  }

  const {data} = useShopQuery({
    //skip query if customerAccessToken does not exist
    query: customerAccessToken ? QUERY : '',
    variables: {
      customerAccessToken,
    },
  });

  const orders =
    data && data.customer && data.customer.orders
      ? flattenConnection(data.customer.orders)
      : [];

  return (
    <Layout>
      <h1>Account</h1>
      <div className="flex items-center justify-between">
        <a
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          href="/api/logout"
        >
          Logout
        </a>
      </div>
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
    </Layout>
  );
}

const QUERY = gql`
  query CustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
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

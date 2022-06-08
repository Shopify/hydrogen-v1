import {
  useShopQuery,
  useRouteParams,
  NoStore,
  Seo,
  useSession,
  flattenConnection,
  Image,
  Money,
  Link,
  gql,
} from '@shopify/hydrogen';
import Layout from '../../../components/Layout.server';

export default function OrderDetails({response}) {
  const {orderId} = useRouteParams();

  response.cache(NoStore());

  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      orderId: decodeURIComponent(orderId),
    },
    cache: NoStore(),
  });

  const order = data.node;

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Order details'}} />
      <div className="flex justify-center mt-8">
        <div className="max-w-md w-full">
          <Link to="/account">{'< Back'}</Link>
          <h1 className="text-5xl mt-4">Order detail.</h1>

          <div className="mt-4 text-gray-500 font-medium">
            {ORDER_STATUS[order.fulfillmentStatus]}
          </div>

          <div className="mt-4">
            {flattenConnection(order.lineItems).map(({variant}) => (
              <div key={variant.id} className="flex h-20 font-medium">
                <Image
                  className="border mr-4"
                  data={variant.image}
                  loaderOptions={{height: 80}}
                />
                <div className="w-full">
                  <div className="flex w-full">
                    <span className="flex-1 mr-4">{variant.title}</span>
                    <span>
                      <Money data={variant.priceV2} />
                    </span>
                  </div>
                  {variant.selectedOptions.map((option) => (
                    <div className="text-sm" key={option.value + option.name}>
                      {option.name}: {option.value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 w-full flex">
            <span className="flex-1">Subtotal</span>
            <Money data={order.currentSubtotalPrice}></Money>
          </div>
          <div className="mt-2 w-full flex">
            <span className="flex-1">Shipping</span>
            <Money data={order.totalShippingPriceV2}></Money>
          </div>
          <div className="mt-2 w-full flex">
            <span className="flex-1">Tax</span>
            <Money data={order.currentTotalTax}></Money>
          </div>
          <div className="mt-4 w-full flex font-medium">
            <span className="flex-1">Total</span>
            <Money data={order.currentTotalPrice}></Money>
          </div>

          <h3 className="mt-6 font-medium text-sm text-gray-500">Date</h3>
          <p className="mt-1">{order.processedAt}</p>
          <hr className="mt-6 border-gray-300" />

          <h3 className="mt-6 font-medium text-sm text-gray-500">
            Shipping method
          </h3>
          <p className="mt-1">Standard Shipping</p>
          <hr className="mt-6 border-gray-300" />

          <h3 className="mt-6 font-medium text-sm text-gray-500">
            Order number
          </h3>
          <p className="mt-1">{order.orderNumber}</p>
          <hr className="mt-6 border-gray-300" />

          <h3 className="mt-6 font-medium text-sm text-gray-500">
            Shipping address
          </h3>
          <div className="mt-1">
            <div>{order.shippingAddress.name}</div>
            <div>{order.shippingAddress.steet1}</div>
            <div>{order.shippingAddress.steet2}</div>
            <div>
              {order.shippingAddress.city}, {order.shippingAddress.province},{' '}
              {order.shippingAddress.zip}
            </div>
            <div>{order.shippingAddress.countryCodeV2}</div>
            <div>{order.shippingAddress.phone}</div>
          </div>
          <hr className="mt-6 border-gray-300" />

          <h3 className="mt-6 font-medium text-sm text-gray-500">
            Billing address
          </h3>
          <p className="mt-1">Same as shipping address</p>
        </div>
      </div>
    </Layout>
  );
}

const QUERY = gql`
  query OrderDetails($orderId: ID!) {
    node(id: $orderId) {
      id
      ... on Order {
        id
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        currentTotalPrice {
          amount
          currencyCode
        }
        currentTotalTax {
          amount
          currencyCode
        }
        currentSubtotalPrice {
          amount
          currencyCode
        }
        totalShippingPriceV2 {
          amount
          currencyCode
        }
        shippingAddress {
          name
          address1
          address2
          province
          zip
          city
          countryCodeV2
          phone
        }
        lineItems(first: 2) {
          edges {
            node {
              variant {
                id
                title
                priceV2 {
                  currencyCode
                  amount
                }
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                  height
                  width
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const ORDER_STATUS = {
  ATTEMPTED_DELIVERY: 'Attempted delivery',
  CANCELED: 'Canceled',
  CONFIRMED: 'Confirmed',
  DELIVERED: 'Delivered',
  FAILURE: 'Failure',
  FULFILLED: 'Fulfilled',
  IN_TRANSIT: 'In transit',
  LABEL_PRINTED: 'Label printed',
  LABEL_PURCHASED: 'Label purchased',
  LABEL_VOIDED: 'Label voided',
  MARKED_AS_FULFILLED: 'Marked as fulfilled',
  NOT_DELIVERED: 'Not delivered',
  OUT_FOR_DELIVERY: 'Out for delivery',
  PICKED_UP: 'Displayed as Picked up',
  READY_FOR_PICKUP: 'Ready for pickup',
  SUBMITTED: 'Submitted',
  UNFULFILLED: 'Not yet shipped!',
};

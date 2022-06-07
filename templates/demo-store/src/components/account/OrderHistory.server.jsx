import {flattenConnection, Image, Link} from '@shopify/hydrogen';
import {ORDER_STATUS} from '../../routes/account/orders/[orderId].server';

export default function OrderHistory({orders}) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl">Order History</h2>
      {!orders.length ? <EmptyOrders /> : <Orders orders={orders} />}
    </div>
  );
}

function Orders({orders}) {
  return (
    <div className="flex mt-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 w-1/2 mr-4 text-sm last:mr-0"
        >
          <div>{ORDER_STATUS[order.fulfillmentStatus]}</div>
          <div>
            {flattenConnection(order.lineItems).map(({variant}) => (
              <Image
                key={variant.image.url}
                data={variant.image}
                loaderOptions={{height: 80}}
                className="border mt-2"
              />
            ))}
          </div>
          <div className="mt-4 text-gray-500">
            Order No. {order.orderNumber}
          </div>
          <Link
            className="mt-4 bg-gray-900 text-white uppercase py-3 px-4 focus:shadow-outline block w-full text-center"
            to={`/account/orders/${encodeURIComponent(order.id)}`}
          >
            Order detail
          </Link>
        </div>
      ))}
    </div>
  );
}

function EmptyOrders() {
  return (
    <>
      <div className="my-4 text-gray-500">No orders yet</div>
      <div className="flex items-center justify-between">
        <Link
          to="/collections/freestyle-collection"
          className="text-center border border-gray-900 uppercase py-3 px-4 focus:shadow-outline block w-full"
        >
          Start shopping
        </Link>
      </div>
    </>
  );
}

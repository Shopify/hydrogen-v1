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
          className="w-1/2 p-4 mr-4 text-sm bg-white last:mr-0"
        >
          <div>{ORDER_STATUS[order.fulfillmentStatus]}</div>
          <div>
            {flattenConnection(order.lineItems).map(({variant}) => (
              <Image
                key={variant.image.url}
                data={variant.image}
                loaderOptions={{height: 80}}
                className="mt-2 border"
              />
            ))}
          </div>
          <div className="mt-4 text-gray-500">
            Order No. {order.orderNumber}
          </div>
          <Link
            className="block w-full px-4 py-3 mt-4 text-center text-white uppercase bg-gray-900 focus:shadow-outline"
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
          to="/collections/freestyle"
          className="text-center border border-gray-900 uppercase py-3 px-4 focus:shadow-outline block w-full"
        >
          Start shopping
        </Link>
      </div>
    </>
  );
}

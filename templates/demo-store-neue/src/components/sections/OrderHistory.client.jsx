import {OrderCard} from '~/components/blocks';
import {Button, Text} from '~/components/elements';

export function OrderHistory({orders}) {
  return (
    <div className="mt-6">
      {!orders.length ? <EmptyOrders /> : <Orders orders={orders} />}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
      <h2 className="font-bold text-lead">Order History</h2>
      <div>
        <Text className="mb-1" size="sm" width="narrow" as="p">
          You haven&apos;t placed any orders yet.
        </Text>
        <div className="w-48">
          <Button className="text-sm mt-2 w-full" variant="secondary" to={'/'}>
            Start Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

function Orders({orders}) {
  return (
    <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
      <h2 className="font-bold text-lead">Order History</h2>
      <ul className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 false  sm:grid-cols-3">
        {orders.map((order) => (
          <OrderCard order={order} key={order.id} />
        ))}
      </ul>
    </div>
  );
}

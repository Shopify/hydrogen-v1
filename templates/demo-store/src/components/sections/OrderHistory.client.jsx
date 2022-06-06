import OrderCard from '../blocks/OrderCard.client';
import PageHeader from './PageHeader';
import {Button, Text} from '../elements';
import LogoutButton from '../elements/LogoutButton.client';

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

export default function OrderHistory(props) {
  const {orders, heading} = props;
  return (
    <>
      {orders.length ? (
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
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            >
              {orders.map((order) => (
                <OrderCard order={order} key={order.id} />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <EmptyOrders heading={heading} />
      )}
    </>
  );
}

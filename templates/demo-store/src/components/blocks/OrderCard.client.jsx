import {Image, Link, flattenConnection} from '@shopify/hydrogen';
import {Text} from '~/components/elements';

function fulfillmentStatus(status) {
  let text = status;
  switch (status) {
    case 'FULFILLED':
      text = 'Fulfilled';
      break;
    case 'IN_PROGRESS':
      text = 'In Progress';
      break;
    case 'ON_HOLD':
      text = 'On Hold';
      break;
    case 'OPEN':
      text = 'Open';
      break;
    case 'PARTIALLY_FULFILLED':
      text = 'Partially Fulfilled';
      break;
    case 'PENDING_FULFILLMENT':
      text = 'Pending';
      break;
    case 'RESTOCKED':
      text = 'Restocked';
      break;
    case 'SCHEDULED':
      text = 'Scheduled';
      break;
    case 'UNFULFILLED':
      text = 'Unfulfilled';
      break;
    default:
      text = status;
  }
  return text;
}

export default function OrderCard(props) {
  const {order} = props;
  const lineItems =
    order?.lineItems?.edges.length > 0
      ? flattenConnection(order.lineItems)
      : [];
  return (
    <li className="col-span-1 flex flex-col text-center rounded border-gray-200 border divide-y divide-gray-200 justify-around">
      <Link
        className="flex-1 flex flex-row lg:p-8 p-6 items-center"
        to={`/account/orders/${encodeURIComponent(order.id)}`}
      >
        <Image
          key={lineItems[0].variant?.image?.url}
          className="lg:w-42 lg:h-42 md:w-36 md:h-36 w-32 h-32 flex"
          alt={lineItems[0].variant?.image?.altText}
          data={lineItems[0].variant?.image}
        />
        <div className="flex-col text-left justify-center">
          <Text as="h3" className="mb-1" size="copy" color="primary">
            {lineItems[0].title}{' '}
            {lineItems.length > 1 && `+ ${lineItems.length - 1} more`}
          </Text>
          <dl className="grid grid-gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <Text size="copy" color="subtle">
                Order No. {order.orderNumber}
              </Text>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <Text size="copy" color="subtle">
                {new Date(order.processedAt).toDateString()}
              </Text>
            </dd>
            <dt className="sr-only">Fulfillment Status</dt>
            <dd className="mt-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Text size="fine">
                  {fulfillmentStatus(order.fulfillmentStatus)}
                </Text>
              </span>
            </dd>
          </dl>
        </div>
      </Link>
      <div className="-mt-px flex divide-x divide-gray-200">
        <div className="w-0 flex-1 flex">
          <Link
            to={`/account/orders/${encodeURIComponent(order.id)}`}
            className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
          >
            <span className="ml-3">View Details</span>
          </Link>
        </div>
      </div>
    </li>
  );
}

import {Image, Link, flattenConnection} from '@shopify/hydrogen';

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
    <li className="col-span-1 flex flex-col text-center bg-white rounded border-gray-200 border divide-y divide-gray-200">
      <Link to="#">
        <div className="flex-1 flex flex-row p-8 align-middle">
          <Image
            key={lineItems[0].variant?.image?.url}
            className="lg:w-48 lg:h-48 md:w-36 md:h-36 w-32 h-32 flex"
            alt={lineItems[0].variant?.image?.altText}
            data={lineItems[0].variant?.image}
          />
          <div className="flex-col text-left justify-center">
            <h3 className="text-gray-900 font-medium">
              {lineItems[0].title}{' '}
              {lineItems.length > 1 && `+ ${lineItems.length - 1} more`}
            </h3>
            <dl className="mt-1 flex-grow flex flex-col justify-between">
              <dt className="sr-only">Order ID</dt>
              <dd className="text-gray-500 text-sm">
                Order No. {order.orderNumber}
              </dd>
              <dt className="sr-only">Order Date</dt>
              <dd className="text-gray-500 text-sm mt-1">
                {new Date(order.processedAt).toDateString()}
              </dd>
              <dt className="sr-only">Fulfillment Status</dt>
              <dd className="mt-3">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    order.fulfillmentStatus === 'FULFILLED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {fulfillmentStatus(order.fulfillmentStatus)}
                </span>
              </dd>
            </dl>
          </div>
        </div>
      </Link>
      <div className="-mt-px flex divide-x divide-gray-200">
        <div className="w-0 flex-1 flex">
          <Link
            to="#"
            className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
          >
            <span className="ml-3">View Order Details</span>
          </Link>
        </div>
      </div>
    </li>
  );
}

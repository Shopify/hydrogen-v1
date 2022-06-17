import {Image, Link, flattenConnection} from '@shopify/hydrogen';
import type {Order} from '@shopify/hydrogen/storefront-api-types';

import {Text} from '~/components';
import {statusMessage} from '~/lib/utils';

export function OrderCard({order}: {order: Order}) {
  if (!order?.id) return null;
  const legacyOrderId = order!.id!.split('/').pop()!.split('?')[0];
  const lineItems = flattenConnection(order?.lineItems);

  return (
    <li className="col-span-1 flex flex-col text-center rounded border-gray-200 border divide-y divide-gray-200 justify-around">
      <Link
        className="flex-1 flex flex-row lg:p-8 p-6 items-center gap-4"
        to={`/account/orders/${legacyOrderId}`}
      >
        {/* TODO: Fix types */}
        <Image
          key={lineItems[0].variant?.image?.url}
          className="xl:w-64 xl:h-64 lg:w-42 lg:h-42 md:w-36 md:h-36 w-32 h-32 flex"
          alt={lineItems[0].variant?.image?.altText}
          data={lineItems[0].variant?.image}
        />
        <div className="flex-col text-left justify-center">
          <Text as="h3" className="mb-1 font-bold" size="copy" color="primary">
            {lineItems[0].title}{' '}
            {lineItems.length > 1 && `+ ${lineItems.length - 1} more`}
          </Text>
          <dl className="grid grid-gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <Text size="fine" color="subtle">
                Order No. {order.orderNumber}
              </Text>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <Text size="fine" color="subtle">
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
                  {statusMessage(order.fulfillmentStatus)}
                </Text>
              </span>
            </dd>
          </dl>
        </div>
      </Link>
      <div className="-mt-px flex divide-x divide-gray-200">
        <div className="w-0 flex-1 flex">
          <Link
            to={`/account/orders/${legacyOrderId}`}
            className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 dark:text-gray-200"
          >
            <span className="ml-3">View Details</span>
          </Link>
        </div>
      </div>
    </li>
  );
}

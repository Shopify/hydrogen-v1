import {Image, Link, flattenConnection} from '@shopify/hydrogen';
import type {
  Order,
  OrderLineItem,
} from '@shopify/hydrogen/storefront-api-types';

import {Text} from '~/components';
import {statusMessage} from '~/lib/utils';

export function OrderCard({order}: {order: Order}) {
  if (!order?.id) return null;
  const legacyOrderId = order!.id!.split('/').pop()!.split('?')[0];
  const lineItems = flattenConnection<OrderLineItem>(order?.lineItems);

  return (
    <li className="flex flex-col justify-around col-span-1 text-center border border-gray-200 divide-y divide-gray-200 rounded">
      <Link
        className="flex flex-row items-center flex-1 gap-4 p-6 lg:p-8"
        to={`/account/orders/${legacyOrderId}`}
      >
        {lineItems[0].variant?.image && (
          <Image
            width={168}
            height={168}
            widths={[336]}
            key={lineItems[0].variant?.image?.url}
            className="flex w-32 h-32 xl:w-64 xl:h-64 lg:w-42 lg:h-42 md:w-36 md:h-36"
            alt={lineItems[0].variant?.image?.altText ?? 'Order image'}
            // @ts-expect-error Stock line item variant image type has `url` as optional
            data={lineItems[0].variant?.image}
          />
        )}
        <div className="flex-col justify-center text-left">
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
      <div className="flex -mt-px divide-x divide-gray-200">
        <div className="flex flex-1 w-0">
          <Link
            to={`/account/orders/${legacyOrderId}`}
            className="relative inline-flex items-center justify-center flex-1 w-0 py-4 -mr-px text-sm font-medium text-gray-700 border border-transparent rounded-bl-lg hover:text-gray-500 dark:text-gray-200"
          >
            <span className="ml-3">View Details</span>
          </Link>
        </div>
      </div>
    </li>
  );
}

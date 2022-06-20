import {
  CacheNone,
  flattenConnection,
  gql,
  type HydrogenRouteProps,
  Image,
  Link,
  Money,
  Seo,
  useRouteParams,
  useSession,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';
import type {
  Customer,
  DiscountApplication,
  DiscountApplicationConnection,
  Order,
  OrderLineItem,
} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';

import {Text, PageHeader} from '~/components';
import {Layout} from '~/components/index.server';
import {statusMessage} from '~/lib/utils';

export default function OrderDetails({response}: HydrogenRouteProps) {
  const {id} = useRouteParams();

  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');
  if (!id) return response.redirect('/account/');

  const {data} = useShopQuery<{
    customer?: Customer;
  }>({
    query: ORDER_QUERY,
    variables: {
      customerAccessToken,
      orderId: `id:${id}`,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const [order] = flattenConnection<Order>(data?.customer?.orders ?? {}) || [
    null,
  ];

  if (!order) return null;

  const lineItems = flattenConnection<OrderLineItem>(order.lineItems!);
  const discountApplications = flattenConnection<DiscountApplication>(
    order.discountApplications as DiscountApplicationConnection,
  );

  const firstDiscount = discountApplications[0]?.value;
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: `Order ${order.name}`}} />
      </Suspense>
      <PageHeader heading={`Order detail`}>
        <Link to="/account">
          <Text color="subtle">Return to Account Overview</Text>
        </Link>
      </PageHeader>
      <div className="w-full p-4 py-6 sm:grid-cols-1 md:p-8 lg:p-12 lg:py-6">
        <div>
          <Text as="h3" size="lead">
            Order No. {order.name}
          </Text>
          <Text className="mt-2" as="p">
            Placed on {new Date(order.processedAt!).toDateString()}
          </Text>
          <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-4 md:gap-16 sm:divide-y sm:divide-gray-200">
            <table className="min-w-full my-8 divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-0 pr-3 text-left text-sm font-semibold"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-sm font-semibold sm:table-cell md:table-cell text-right"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-sm font-semibold sm:table-cell md:table-cell text-right"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-semibold text-right"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lineItems.map((lineItem) => (
                  <tr key={lineItem.variant!.id}>
                    <td className="w-full py-4 pl-0 pr-3 text-sm font-medium max-w-0 sm:w-auto sm:max-w-none">
                      <div className="flex">
                        <Link
                          to={`/products/${lineItem.variant!.product!.handle}`}
                        >
                          {lineItem?.variant?.image && (
                            <Image
                              className="flex-none object-cover object-center w-24 h-24 bg-gray-100 rounded-md"
                              src={lineItem.variant.image.src!}
                              width={lineItem.variant.image.width!}
                              height={lineItem.variant.image.height!}
                              alt={lineItem.variant.image.altText!}
                            />
                          )}
                        </Link>
                        <div className="flex-col hidden ml-6 lg:flex">
                          <Text as="p">{lineItem.title}</Text>
                          <Text size="fine" className="mt-1" as="p">
                            {lineItem.variant!.title}
                          </Text>
                        </div>
                        <dl className="flex-col ml-4">
                          <dt className="sr-only">Product</dt>
                          <dd className="truncate lg:hidden">
                            <Text as="h3">{lineItem.title}</Text>
                            <Text size="fine" className="mt-1" as="p">
                              {lineItem.variant!.title}
                            </Text>
                          </dd>
                          <dt className="sr-only">Price</dt>
                          <dd className="truncate sm:hidden md:hidden lg:hidden">
                            <Text size="fine" className="mt-4">
                              <Money data={lineItem.variant!.priceV2!} />
                            </Text>
                          </dd>
                          <dt className="sr-only">Quantity</dt>
                          <dd className="truncate sm:hidden md:hidden lg:hidden">
                            <Text className="mt-1" size="fine" as="p">
                              Qty: {lineItem.quantity}
                            </Text>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-right sm:table-cell">
                      <Money data={lineItem.variant!.priceV2!} />
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-right sm:table-cell">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-sm text-right sm:table-cell">
                      <Text>
                        <Money data={lineItem.discountedTotalPrice!} />
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {((discountValue && discountValue.amount) ||
                  discountPercentage) && (
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <th
                      scope="row"
                      className="pt-6 pr-3 font-normal text-left sm:hidden"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <td className="pt-6 pl-3 pr-4 font-medium text-right text-green-700 md:pr-3">
                      {discountPercentage ? (
                        <span className="text-sm">
                          -{discountPercentage}% OFF
                        </span>
                      ) : (
                        discountValue && <Money data={discountValue!} />
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <th
                    scope="row"
                    className="pt-6 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <td className="pt-6 pl-3 pr-4 text-right md:pr-3">
                    <Money data={order.subtotalPriceV2!} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    Tax
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Tax</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 text-right md:pr-3">
                    <Money data={order.totalTaxV2!} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-semibold text-right sm:table-cell md:pl-0"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-semibold text-left sm:hidden"
                  >
                    <Text>Total</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 font-semibold text-right md:pr-3">
                    <Money data={order.totalPriceV2!} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="border-none">
              <Text as="h3" size="lead">
                Shipping Address
              </Text>
              {order?.shippingAddress ? (
                <ul className="mt-6">
                  <li>
                    <Text>
                      {order.shippingAddress.firstName &&
                        order.shippingAddress.firstName + ' '}
                      {order.shippingAddress.lastName}
                    </Text>
                  </li>
                  {order?.shippingAddress?.formatted ? (
                    order.shippingAddress.formatted.map((line) => (
                      <li key={line}>
                        <Text>{line}</Text>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <p className="mt-3">No shipping address defined</p>
              )}
              <Text as="h3" size="lead" className="mt-8">
                Status
              </Text>
              <div
                className={`mt-3 px-3 py-1 text-xs font-medium rounded-full inline-block w-auto ${
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Text size="fine">
                  {statusMessage(order.fulfillmentStatus!)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// @see: https://shopify.dev/api/storefront/2022-07/objects/Order#fields
const ORDER_QUERY = gql`
  fragment MoneyV2 on MoneyV2 {
    amount
    currencyCode
  }

  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    id
    lastName
    name
    phone
    province
    provinceCode
    zip
  }

  fragment DiscountApplication on DiscountApplication {
    value {
      ... on MoneyV2 {
        amount
        currencyCode
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }

  fragment Image on Image {
    altText
    height
    src: transformedSrc(maxHeight: 160)
    id
    width
  }

  fragment ProductVariant on ProductVariant {
    image {
      ...Image
    }
    priceV2 {
      ...MoneyV2
    }
    product {
      handle
    }
    sku
    title
  }

  fragment LineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...MoneyV2
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...MoneyV2
    }
    discountedTotalPrice {
      ...MoneyV2
    }
    variant {
      ...ProductVariant
    }
  }

  query orderById(
    $customerAccessToken: String!
    $orderId: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderId) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            fulfillmentStatus
            totalTaxV2 {
              ...MoneyV2
            }
            totalPriceV2 {
              ...MoneyV2
            }
            subtotalPriceV2 {
              ...MoneyV2
            }
            shippingAddress {
              ...AddressFull
            }
            discountApplications(first: 100) {
              edges {
                node {
                  ...DiscountApplication
                }
              }
            }
            lineItems(first: 100) {
              edges {
                node {
                  ...LineItemFull
                }
              }
            }
          }
        }
      }
    }
  }
`;

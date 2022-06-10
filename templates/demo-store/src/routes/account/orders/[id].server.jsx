import {
  flattenConnection,
  useSession,
  NoStore,
  useShop,
  useShopQuery,
  gql,
  Image,
  Link,
  Money,
  Seo,
} from '@shopify/hydrogen';

import Layout from '~/components/layouts/DefaultLayout.server';
import {PageHeader} from '~/components/sections';
import {Text} from '~/components/elements';
import fulfillmentStatus from '~/components/utilities/fulfillmentStatus.helper';

export default function AccountOrder({response, params}) {
  response.cache(NoStore());

  const {languageCode} = useShop();
  const {customerAccessToken, countryCode = 'US'} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');
  if (!params?.id) return response.redirect('/account/');

  const {data} = useShopQuery({
    query: ORDER_QUERY,
    variables: {
      customerAccessToken,
      orderId: `id:${params.id}`,
      language: languageCode,
      country: countryCode,
    },
    cache: NoStore(),
  });

  const order = data?.customer?.orders?.edges[0].node;
  const lineItems =
    order?.lineItems?.edges.length > 0
      ? flattenConnection(order.lineItems)
      : [];

  let discountPercentage, discountValue, discountAmount;

  const discountApplications =
    order?.discountApplications?.edges.length > 0
      ? flattenConnection(order.discountApplications)
      : [];

  if (discountApplications.length > 0) {
    discountPercentage = discountApplications[0].value.percentage;
    discountValue = discountApplications[0].value;
    discountAmount = discountValue.amount;
  }

  return (
    <Layout>
      <Seo type="noindex" data={{title: `Order ${order.name}`}} />
      <PageHeader heading={`Order detail`}>
        <Link to="/account">
          <Text color="subtle">Return to Account Overview</Text>
        </Link>
      </PageHeader>
      <div className="sm:grid-cols-1 w-full p-4 py-6 md:p-8 lg:p-12 lg:py-6">
        <div>
          <Text as="h3" size="lead">
            Order No. {order.name}
          </Text>
          <Text className="mt-2" as="p">
            Placed on {new Date(order.processedAt).toDateString()}
          </Text>
          <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 sm:divide-y sm:divide-gray-200">
            <table className="min-w-full divide-y divide-gray-300 my-8 md:col-span-3">
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
                {lineItems.map((lineItem, idx) => (
                  <tr key={idx}>
                    <td className="w-full max-w-0 py-4 pl-0 pr-3 text-sm font-medium sm:w-auto sm:max-w-none">
                      <div className="flex">
                        <Link
                          to={`/products/${lineItem.variant.product.handle}`}
                        >
                          <Image
                            className="flex-none w-24 h-24 bg-gray-100 rounded-md object-center object-cover"
                            src={lineItem?.variant?.image.src}
                            width={lineItem?.variant?.image.width}
                            height={lineItem?.variant?.image.height}
                          />
                        </Link>
                        <div className="flex-col ml-6 hidden lg:flex">
                          <Text as="p">{lineItem.title}</Text>
                          <Text size="fine" className="mt-1" as="p">
                            {lineItem.variant.title}
                          </Text>
                        </div>
                        <dl className="ml-4 flex-col">
                          <dt className="sr-only">Product</dt>
                          <dd className="truncate lg:hidden">
                            <Text as="h3">{lineItem.title}</Text>
                            <Text size="fine" className="mt-1" as="p">
                              {lineItem.variant.title}
                            </Text>
                          </dd>
                          <dt className="sr-only">Price</dt>
                          <dd className="truncate sm:hidden md:hidden lg:hidden">
                            <Text size="fine" className="mt-4">
                              <Money data={lineItem.variant.priceV2} />
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
                    <td className="hidden px-3 py-4 text-sm sm:table-cell text-right">
                      <Money data={lineItem.variant.priceV2} />
                    </td>
                    <td className="hidden px-3 py-4 text-sm sm:table-cell text-right">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-sm sm:table-cell text-right">
                      <Text>
                        <Money data={lineItem.discountedTotalPrice} />
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {(discountAmount || discountPercentage > 0) && (
                  <tr>
                    <th
                      scope="row"
                      colSpan="3"
                      className="hidden pl-6 pr-3 pt-6 font-normal text-right sm:table-cell md:pl-0"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <th
                      scope="row"
                      className="pr-3 pt-6 font-normal text-left sm:hidden"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <td className="pl-3 pr-4 pt-6 text-right md:pr-3 text-green-700 font-medium">
                      {discountPercentage > 0 ? (
                        <span className="text-sm">
                          -{discountPercentage}% OFF
                        </span>
                      ) : (
                        <Money data={discountValue} />
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pl-6 pr-3 pt-6 font-normal text-right sm:table-cell md:pl-0"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <th
                    scope="row"
                    className="pr-3 pt-6 font-normal text-left sm:hidden"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <td className="pl-3 pr-4 pt-6 text-right md:pr-3">
                    <Money data={order.subtotalPriceV2} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pl-6 pr-3 pt-4 text-right font-normal sm:table-cell md:pl-0"
                  >
                    Tax
                  </th>
                  <th
                    scope="row"
                    className="pr-3 pt-4 text-left font-normal sm:hidden"
                  >
                    <Text>Tax</Text>
                  </th>
                  <td className="pl-3 pr-4 pt-4 text-right md:pr-3">
                    <Money data={order.totalTaxV2} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pl-6 pr-3 pt-4 text-right font-semibold sm:table-cell md:pl-0"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    className="pr-3 pt-4 text-left font-semibold sm:hidden"
                  >
                    <Text>Total</Text>
                  </th>
                  <td className="pl-3 pr-4 pt-4 text-right font-semibold md:pr-3">
                    <Money data={order.totalPriceV2} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="border-none">
              <Text as="h3" size="lead">
                Shipping Address
              </Text>
              <ul className="mt-6" role="list">
                <li>
                  <Text>
                    {order.shippingAddress.firstName &&
                      order.shippingAddress.firstName + ' '}
                    {order.shippingAddress.lastName}
                  </Text>
                </li>
                {order?.shippingAddress?.formatted ? (
                  order.shippingAddress.formatted.map((line, index) => (
                    <li key={line + index}>
                      <Text>{line}</Text>
                    </li>
                  ))
                ) : (
                  <></>
                )}
              </ul>
              <div
                className={`mt-3 px-3 py-1 text-xs font-medium rounded-full inline-block w-auto ${
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Text size="fine">
                  {fulfillmentStatus(order.fulfillmentStatus)}
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

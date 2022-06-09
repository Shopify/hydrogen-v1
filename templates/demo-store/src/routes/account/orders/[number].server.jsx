import {
  useSession,
  NoStore,
  useShop,
  useShopQuery,
  gql,
} from '@shopify/hydrogen';

export default function AccountOrder({response, params}) {
  response.cache(NoStore());

  const {languageCode} = useShop();
  const {customerAccessToken, countryCode = 'US'} = useSession();

  if (!customerAccessToken || !params?.number)
    return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: ORDER_QUERY,
    variables: {
      customerAccessToken,
      orderNumber: `number:${params.number}`,
      language: languageCode,
      country: countryCode,
    },
    cache: NoStore(),
  });
  return (
    <div>
      Order {params.number}
      <br />
      <pre>{JSON.stringify(data, null, 1)}</pre>
    </div>
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
    formattedArea
    id
    lastName
    latitude
    longitude
    name
    phone
    province
    provinceCode
    zip
  }

  fragment DiscountApplication on DiscountApplication {
    allocationMethod
    targetSelection
    targetType
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

  fragment SellingPlanAllocation on SellingPlanAllocation {
    priceAdjustments {
      compareAtPrice {
        ...MoneyV2
      }
      price {
        ...MoneyV2
      }
      perDeliveryPrice {
        ...MoneyV2
      }
      unitPrice {
        ...MoneyV2
      }
    }
  }

  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPriceV2 {
      ...MoneyV2
    }
    currentlyNotInStock
    id
    image {
      ...Image
    }
    priceV2 {
      ...MoneyV2
    }
    product {
      handle
      id
      title
      tags
    }
    sellingPlanAllocations(first: 10) {
      edges {
        node {
          ...SellingPlanAllocation
        }
      }
    }
    quantityAvailable
    requiresShipping
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      ...MoneyV2
    }
    unitPriceMeasurement {
      measuredType
      quantityUnit
      quantityValue
    }
    weight
    weightUnit
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

  query order(
    $customerAccessToken: String!
    $orderNumber: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderNumber) {
        edges {
          node {
            id
            name
            orderNumber
            statusUrl
            canceledAt
            cancelReason
            currencyCode
            processedAt
            email
            phone
            financialStatus
            fulfillmentStatus
            customerLocale
            currentSubtotalPrice {
              ...MoneyV2
            }
            currentTotalTax {
              ...MoneyV2
            }
            currentTotalPrice {
              ...MoneyV2
            }
            currentTotalDuties {
              ...MoneyV2
            }
            totalTaxV2 {
              ...MoneyV2
            }
            totalRefundedV2 {
              ...MoneyV2
            }
            totalPriceV2 {
              ...MoneyV2
            }
            subtotalPriceV2 {
              ...MoneyV2
            }
            totalShippingPriceV2 {
              ...MoneyV2
            }
            shippingAddress {
              ...AddressFull
            }
            successfulFulfillments(first: 100) {
              trackingCompany
              trackingInfo(first: 100) {
                url
              }
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

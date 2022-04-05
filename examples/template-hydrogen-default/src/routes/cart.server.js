export async function api(request, {queryShop}) {
  // TODO: Look up cart ID from session instead of passing explicitly

  if (request.method === 'GET') {
    return getCart(request, queryShop);
  }
}

async function getCart(request, queryShop) {
  const params = new URL(request.url).searchParams;
  const id = params.get('id');
  const country = params.get('country');

  if (!id) {
    throw new Error('Missing cartId');
  }

  return await queryShop({query: CART_QUERY, variables: {id, country}});
}

const CART_QUERY = `
  query CartQuery($id: ID!, $country: CountryCode = ZZ) @inContext(country: $country) {
    cart(id: $id) {
      id
      checkoutUrl
      buyerIdentity {
        countryCode
        customer {
          id
          email
          firstName
          lastName
          displayName
        }
        email
        phone
      }
      lines(first: 250) {
        edges {
          node {
            id
            quantity
            attributes {
              key
              value
            }
            merchandise {
              ... on ProductVariant {
                id
                availableForSale
                compareAtPriceV2 {
                  currencyCode
                  amount
                }
                priceV2 {
                  currencyCode
                  amount
                }
                requiresShipping
                title
                image {
                  id
                  url
                  altText
                  width
                  height
                }
                product {
                  handle
                  title
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
      estimatedCost {
        subtotalAmount {
          currencyCode
          amount
        }
        totalAmount {
          currencyCode
          amount
        }
        totalDutyAmount {
          currencyCode
          amount
        }
        totalTaxAmount {
          currencyCode
          amount
        }
      }
      note
      attributes {
        key
        value
      }
      discountCodes {
        code
      }
    }
  }
`;

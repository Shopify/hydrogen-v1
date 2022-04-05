export async function api(request, {queryShop}) {
  // TODO: Look up cart ID from session instead of passing explicitly

  if (request.method === 'GET') {
    return getCart(request, queryShop);
  }

  const data = await request.json();

  switch (data._action) {
    case 'cartCreate':
      return createCart(data, queryShop);
    case 'addLineItem':
      return addLineItem(data, queryShop);
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

async function createCart(data, queryShop) {
  return await queryShop({
    query: CREATE_CART_QUERY,
    variables: {input: data.input, country: data.cart},
  });
}

async function addLineItem(data, queryShop) {
  return await queryShop({
    query: ADD_LINE_ITEM_QUERY,
    variables: {cartId: data.cartId, lines: data.lines, country: data.cart},
  });
}

const CART_FRAGMENT = `#graphql
  fragment CartFragment on Cart {
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
`;

const CART_QUERY = `
  query CartQuery($id: ID!, $country: CountryCode = ZZ) @inContext(country: $country) {
    cart(id: $id) {
      ...CartFragment
    }
  }

  ${CART_FRAGMENT}
`;

const CREATE_CART_QUERY = `#graphql
  mutation CartCreate($input: CartInput!, $country: CountryCode = ZZ) @inContext(country: $country) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }

  ${CART_FRAGMENT}
`;

const ADD_LINE_ITEM_QUERY = `#graphql
  mutation CartLineAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode = ZZ) @inContext(country: $country) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
    }
  }

  ${CART_FRAGMENT}
`;

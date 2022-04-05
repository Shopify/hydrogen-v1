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
    case 'removeLineItem':
      return removeLineItem(data, queryShop);
    case 'updateLineItem':
      return updateLineItem(data, queryShop);
    case 'updateNote':
      return updateNote(data, queryShop);
    case 'updateBuyerIdentity':
      return updateBuyerIdentity(data, queryShop);
    case 'updateCartAttributes':
      return updateCartAttributes(data, queryShop);
    default:
      return new Response('Invalid action', {status: 400});
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
    variables: {input: data.input, country: data.country},
  });
}

async function addLineItem(data, queryShop) {
  return await queryShop({
    query: ADD_LINE_ITEM_QUERY,
    variables: {cartId: data.cartId, lines: data.lines, country: data.country},
  });
}

async function removeLineItem(data, queryShop) {
  return await queryShop({
    query: REMOVE_LINE_ITEM_QUERY,
    variables: {cartId: data.cartId, lines: data.lines, country: data.country},
  });
}

async function updateLineItem(data, queryShop) {
  return await queryShop({
    query: UPDATE_LINE_ITEM_QUERY,
    variables: {cartId: data.cartId, lines: data.lines, country: data.country},
  });
}

async function updateNote(data, queryShop) {
  return await queryShop({
    query: UPDATE_NOTE_QUERY,
    variables: {cartId: data.cartId, note: data.note, country: data.country},
  });
}

async function updateBuyerIdentity(data, queryShop) {
  return await queryShop({
    query: UPDATE_BUYER_IDENTITY_QUERY,
    variables: {
      cartId: data.cartId,
      buyerIdentity: data.buyerIdentity,
      country: data.country,
    },
  });
}

async function updateCartAttributes(data, queryShop) {
  return await queryShop({
    query: UPDATE_CART_ATTRIBUTES_QUERY,
    variables: {
      cartId: data.cartId,
      attributes: data.attributes,
      country: data.country,
    },
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

const REMOVE_LINE_ITEM_QUERY = `#graphql
  mutation CartLineRemove($cartId: ID!, $lines: [ID!]!, $country: CountryCode = ZZ) @inContext(country: $country) {
    cartLinesRemove(cartId: $cartId, lineIds: $lines) {
      cart {
        ...CartFragment
      }
    }
  }

  ${CART_FRAGMENT}
`;

const UPDATE_LINE_ITEM_QUERY = `#graphql
  mutation CartLineUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode = ZZ) @inContext(country: $country) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
    }
  }

  ${CART_FRAGMENT}
`;

const UPDATE_NOTE_QUERY = `#graphql
  mutation CartNoteUpdate($cartId: ID!, $note: String, $country: CountryCode = ZZ) @inContext(country: $country) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart {
        ...CartFragment
      }
    }
  }

  ${CART_FRAGMENT}
`;

const UPDATE_BUYER_IDENTITY_QUERY = `#graphql
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
    $country: CountryCode = ZZ
  ) @inContext(country: $country) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFragment
      }
    }
  }

  ${CART_FRAGMENT}
`;

const UPDATE_CART_ATTRIBUTES_QUERY = `#graphql
  mutation CartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!, $country: CountryCode = ZZ) @inContext(country: $country) {
    cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
      cart {
        ...CartFragment
      }
    }
  }

  ${CART_FRAGMENT}
`;

import {gql} from '@shopify/hydrogen';

const CART_FRAGMENT = gql`
  fragment CartFragment on Cart {
    id
    createdAt
    updatedAt
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              title
              id
              product {
                title
                images(first: 1) {
                  edges {
                    node {
                      src
                      thumb: url(transform: {maxWidth: 100})
                      id
                      height
                      width
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Queries
 */
export const CART_GET_QUERY = gql`
  ${CART_FRAGMENT}
  query getCart($id: ID!) {
    cart(id: $id) {
      ...CartFragment
    }
  }
`;

/**
 * Mutations
 */
export const CART_LINES_REMOVE_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    query: cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    query: cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_CREATE_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation createCart($input: CartInput!) {
    query: cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

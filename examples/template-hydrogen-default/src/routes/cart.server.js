import gql from 'graphql-tag';

export async function api(request, {queryShop}) {
  const {action, variables} = await request.json();

  if (!action) {
    throw new Error('You must provide an action');
  }

  switch (action) {
    case 'getCart':
      return await getCart(variables, queryShop);

    // ...
  }
}

async function getCart(variables, queryShop) {
  return await queryShop({
    query: CART_QUERY,
    variables,
  });
}

const CART_QUERY = gql`
  query CartQuery(
    $id: ID!
    $numCartLines: Int = 250
    $country: CountryCode = ZZ
  ) @inContext(country: $country) {
    cart(id: $id) {
      ...CartFragment
    }
  }

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
    lines(first: $numCartLines) {
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
                ...MoneyFragment
              }
              priceV2 {
                ...MoneyFragment
              }
              requiresShipping
              title
              image {
                ...ImageFragment
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
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
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

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;

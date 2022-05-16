export const CartLineAdd = `
mutation CartLineAdd($cartId: ID!, $lines: [CartLineInput!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
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

export const CartCreate = `
mutation CartCreate($input: CartInput!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
  cartCreate(input: $input) {
    cart {
      ...CartFragment
    }
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

export const CartLineRemove = `
mutation CartLineRemove($cartId: ID!, $lines: [ID!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
  cartLinesRemove(cartId: $cartId, lineIds: $lines) {
    cart {
      ...CartFragment
    }
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

export const CartLineUpdate = `
mutation CartLineUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
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

export const CartNoteUpdate = `
mutation CartNoteUpdate($cartId: ID!, $note: String, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
  cartNoteUpdate(cartId: $cartId, note: $note) {
    cart {
      ...CartFragment
    }
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

export const CartBuyerIdentityUpdate = `
mutation CartBuyerIdentityUpdate(
  $cartId: ID!
  $buyerIdentity: CartBuyerIdentityInput!
  $numCartLines: Int = 250
  $country: CountryCode = ZZ
) @inContext(country: $country) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
    cart {
      ...CartFragment
    }
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

export const CartAttributesUpdate = `
mutation CartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
  cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
    cart {
      ...CartFragment
    }
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

export const CartDiscountCodesUpdate = `
mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      ...CartFragment
    }
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

export const CartQuery = `
query CartQuery($id: ID!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
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

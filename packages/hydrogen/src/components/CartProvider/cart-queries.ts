export const CartLineAdd = (cartFragment: string) => `
mutation CartLineAdd($cartId: ID!, $lines: [CartLineInput!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartCreate = (cartFragment: string) => `
mutation CartCreate($input: CartInput!, $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cartCreate(input: $input) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartLineRemove = (cartFragment: string) => `
mutation CartLineRemove($cartId: ID!, $lines: [ID!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cartLinesRemove(cartId: $cartId, lineIds: $lines) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartLineUpdate = (cartFragment: string) => `
mutation CartLineUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartNoteUpdate = (cartFragment: string) => `
mutation CartNoteUpdate($cartId: ID!, $note: String, $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cartNoteUpdate(cartId: $cartId, note: $note) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartBuyerIdentityUpdate = (cartFragment: string) => `
mutation CartBuyerIdentityUpdate(
  $cartId: ID!
  $buyerIdentity: CartBuyerIdentityInput!
  $numCartLines: Int = 250
  $country: CountryCode = ZZ
  $language: LanguageCode
) @inContext(country: $country, language: $language) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartAttributesUpdate = (cartFragment: string) => `
mutation CartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!, $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartDiscountCodesUpdate = (cartFragment: string) => `
mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      ...CartFragment
    }
  }
}

${cartFragment}
`;

export const CartQuery = (cartFragment: string) => `
query CartQuery($id: ID!, $numCartLines: Int = 250, $country: CountryCode = ZZ, $language: LanguageCode) @inContext(country: $country, language: $language) {
  cart(id: $id) {
    ...CartFragment
  }
}

${cartFragment}
`;

export const defaultCartFragment = `
fragment CartFragment on Cart {
  id
  checkoutUrl
  totalQuantity
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
        cost {
          totalAmount {
            amount
            currencyCode
          }
          compareAtAmountPerQuantity {
            amount
            currencyCode
          }
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
              id
              handle
              title
              vendor
              productType
            }
            selectedOptions {
              name
              value
            }
            sku
          }
        }
      }
    }
  }
  cost {
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

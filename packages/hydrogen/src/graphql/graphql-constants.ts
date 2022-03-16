/**
 *```
 *
 * mutation CartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 *
 * mutation CartBuyerIdentityUpdate(
 *   $cartId: ID!
 *   $buyerIdentity: CartBuyerIdentityInput!
 *   $numCartLines: Int = 250
 *   $country: CountryCode = ZZ
 * ) @inContext(country: $country) {
 *   cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 *
 * mutation CartCreate($input: CartInput!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cartCreate(input: $input) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 *
 * mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
export const CartFragment = `fragment CartFragment on Cart {
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

/**
 *```
 *
 * mutation CartLineAdd($cartId: ID!, $lines: [CartLineInput!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cartLinesAdd(cartId: $cartId, lines: $lines) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 *
 * mutation CartLineRemove($cartId: ID!, $lines: [ID!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cartLinesRemove(cartId: $cartId, lineIds: $lines) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 *
 * mutation CartLineUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cartLinesUpdate(cartId: $cartId, lines: $lines) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 *
 * mutation CartNoteUpdate($cartId: ID!, $note: String, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cartNoteUpdate(cartId: $cartId, note: $note) {
 *     cart {
 *       ...CartFragment
 *     }
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
 *```
 *
 * query CartQuery($id: ID!, $numCartLines: Int = 250, $country: CountryCode = ZZ) @inContext(country: $country) {
 *   cart(id: $id) {
 *     ...CartFragment
 *   }
 * }
 *
 * fragment CartFragment on Cart {
 *   id
 *   checkoutUrl
 *   buyerIdentity {
 *     countryCode
 *     customer {
 *       id
 *       email
 *       firstName
 *       lastName
 *       displayName
 *     }
 *     email
 *     phone
 *   }
 *   lines(first: $numCartLines) {
 *     edges {
 *       node {
 *         id
 *         quantity
 *         attributes {
 *           key
 *           value
 *         }
 *         merchandise {
 *           ... on ProductVariant {
 *             id
 *             availableForSale
 *             compareAtPriceV2 {
 *               ...MoneyFragment
 *             }
 *             priceV2 {
 *               ...MoneyFragment
 *             }
 *             requiresShipping
 *             title
 *             image {
 *               ...ImageFragment
 *             }
 *             product {
 *               handle
 *               title
 *             }
 *             selectedOptions {
 *               name
 *               value
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   estimatedCost {
 *     subtotalAmount {
 *       ...MoneyFragment
 *     }
 *     totalAmount {
 *       ...MoneyFragment
 *     }
 *     totalDutyAmount {
 *       ...MoneyFragment
 *     }
 *     totalTaxAmount {
 *       ...MoneyFragment
 *     }
 *   }
 *   note
 *   attributes {
 *     key
 *     value
 *   }
 *   discountCodes {
 *     code
 *   }
 * }
 *
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
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

/**
*```
* fragment ExternalVideoFragment on ExternalVideo {
*   id
*   embedUrl
*   host
* }
* 

*```
*/
export const ExternalVideoFragment = `fragment ExternalVideoFragment on ExternalVideo {
  id
  embedUrl
  host
}

`;

/**
*```
* fragment ImageFragment on Image {
*   id
*   url
*   altText
*   width
*   height
* }
* 

*```
*/
export const ImageFragment = `fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}

`;

/**
*```
* query Localization {
*   localization {
*     country {
*       isoCode
*       name
*       currency {
*         isoCode
*       }
*     }
*     availableCountries {
*       isoCode
*       name
*       currency {
*         isoCode
*       }
*     }
*   }
* }
* 

*```
*/
export const Localization = `query Localization {
  localization {
    country {
      isoCode
      name
      currency {
        isoCode
      }
    }
    availableCountries {
      isoCode
      name
      currency {
        isoCode
      }
    }
  }
}

`;

/**
 *```
 *
 * fragment MediaFileFragment on Media {
 *   ... on MediaImage {
 *     mediaContentType
 *     image {
 *       ...ImageFragment
 *     }
 *   }
 *   ... on Video {
 *     mediaContentType
 *     ...VideoFragment
 *   }
 *   ... on ExternalVideo {
 *     mediaContentType
 *     ...ExternalVideoFragment
 *   }
 *   ... on Model3d {
 *     mediaContentType
 *     ...Model3DFragment
 *   }
 * }
 *
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 * fragment VideoFragment on Video {
 *   id
 *   previewImage {
 *     url
 *   }
 *   sources {
 *     mimeType
 *     url
 *   }
 * }
 *
 * fragment ExternalVideoFragment on ExternalVideo {
 *   id
 *   embedUrl
 *   host
 * }
 *
 * fragment Model3DFragment on Model3d {
 *   id
 *   alt
 *   mediaContentType
 *   previewImage {
 *     url
 *   }
 *   sources {
 *     url
 *   }
 * }
 *
 *```
 */
export const MediaFileFragment = `
fragment MediaFileFragment on Media {
  ... on MediaImage {
    mediaContentType
    image {
      ...ImageFragment
    }
  }
  ... on Video {
    mediaContentType
    ...VideoFragment
  }
  ... on ExternalVideo {
    mediaContentType
    ...ExternalVideoFragment
  }
  ... on Model3d {
    mediaContentType
    ...Model3DFragment
  }
}

fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}

fragment VideoFragment on Video {
  id
  previewImage {
    url
  }
  sources {
    mimeType
    url
  }
}

fragment ExternalVideoFragment on ExternalVideo {
  id
  embedUrl
  host
}

fragment Model3DFragment on Model3d {
  id
  alt
  mediaContentType
  previewImage {
    url
  }
  sources {
    url
  }
}
`;

/**
 *```
 *
 * fragment MetafieldFragment on Metafield {
 *   id
 *   type
 *   namespace
 *   key
 *   value
 *   createdAt
 *   updatedAt
 *   description
 *   reference @include(if: $includeReferenceMetafieldDetails) {
 *     __typename
 *     ... on MediaImage {
 *       id
 *       mediaContentType
 *       image {
 *         ...ImageFragment
 *       }
 *     }
 *   }
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *```
 */
export const MetafieldFragment = `
fragment MetafieldFragment on Metafield {
  id
  type
  namespace
  key
  value
  createdAt
  updatedAt
  description
  reference @include(if: $includeReferenceMetafieldDetails) {
    __typename
    ... on MediaImage {
      id
      mediaContentType
      image {
        ...ImageFragment
      }
    }
  }
}
fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}
`;

/**
*```
* fragment Model3DFragment on Model3d {
*   id
*   alt
*   mediaContentType
*   previewImage {
*     url
*   }
*   sources {
*     url
*   }
* }
* 

*```
*/
export const Model3DFragment = `fragment Model3DFragment on Model3d {
  id
  alt
  mediaContentType
  previewImage {
    url
  }
  sources {
    url
  }
}

`;

/**
*```
* fragment MoneyFragment on MoneyV2 {
*   currencyCode
*   amount
* }

*```
*/
export const MoneyFragment = `fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}
`;

/**
 *```
 *
 * fragment ProductProviderFragment on Product  {
 *   compareAtPriceRange {
 *     maxVariantPrice {
 *       ...MoneyFragment
 *     }
 *     minVariantPrice {
 *       ...MoneyFragment
 *     }
 *   }
 *   descriptionHtml
 *   handle
 *   id
 *   media(first: $numProductMedia) {
 *     edges {
 *       node {
 *         ...MediaFileFragment
 *       }
 *     }
 *   }
 *   metafields(first: $numProductMetafields) {
 *     edges {
 *       node {
 *         ...MetafieldFragment
 *       }
 *     }
 *   }
 *   priceRange {
 *     maxVariantPrice {
 *       ...MoneyFragment
 *     }
 *     minVariantPrice {
 *       ...MoneyFragment
 *     }
 *   }
 *   title
 *   variants(first: $numProductVariants) {
 *     edges {
 *       node {
 *         ...VariantFragment
 *       }
 *     }
 *   }
 *   sellingPlanGroups(first: $numProductSellingPlanGroups) {
 *     edges {
 *       node {
 *         ...SellingPlanGroupsFragment
 *       }
 *     }
 *   }
 * }
 *
 *
 * fragment MediaFileFragment on Media {
 *   ... on MediaImage {
 *     mediaContentType
 *     image {
 *       ...ImageFragment
 *     }
 *   }
 *   ... on Video {
 *     mediaContentType
 *     ...VideoFragment
 *   }
 *   ... on ExternalVideo {
 *     mediaContentType
 *     ...ExternalVideoFragment
 *   }
 *   ... on Model3d {
 *     mediaContentType
 *     ...Model3DFragment
 *   }
 * }
 *
 *
 * fragment MetafieldFragment on Metafield {
 *   id
 *   type
 *   namespace
 *   key
 *   value
 *   createdAt
 *   updatedAt
 *   description
 *   reference @include(if: $includeReferenceMetafieldDetails) {
 *     __typename
 *     ... on MediaImage {
 *       id
 *       mediaContentType
 *       image {
 *         ...ImageFragment
 *       }
 *     }
 *   }
 * }
 *
 * fragment VariantFragment on ProductVariant {
 *   id
 *   title
 *   availableForSale
 *   image {
 *     ...ImageFragment
 *   }
 *   ...UnitPriceFragment
 *   priceV2 {
 *     ...MoneyFragment
 *   }
 *   compareAtPriceV2 {
 *     ...MoneyFragment
 *   }
 *   selectedOptions {
 *     name
 *     value
 *   }
 *   metafields(first: $numProductVariantMetafields) {
 *     edges {
 *       node {
 *         ...MetafieldFragment
 *       }
 *     }
 *   }
 *   sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
 *     edges {
 *       node {
 *         priceAdjustments {
 *           compareAtPrice {
 *             ...MoneyFragment
 *           }
 *           perDeliveryPrice {
 *             ...MoneyFragment
 *           }
 *           price {
 *             ...MoneyFragment
 *           }
 *           unitPrice {
 *             ...MoneyFragment
 *           }
 *         }
 *         sellingPlan {
 *           ...SellingPlanFragment
 *         }
 *       }
 *     }
 *   }
 * }
 *
 *
 * fragment SellingPlanGroupsFragment on SellingPlanGroup {
 *   sellingPlans(first:$numProductSellingPlans) {
 *     edges {
 *       node {
 *         ...SellingPlanFragment
 *       }
 *     }
 *   }
 *   appName
 *   name
 *   options {
 *     name
 *     values
 *   }
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 * fragment VideoFragment on Video {
 *   id
 *   previewImage {
 *     url
 *   }
 *   sources {
 *     mimeType
 *     url
 *   }
 * }
 *
 * fragment ExternalVideoFragment on ExternalVideo {
 *   id
 *   embedUrl
 *   host
 * }
 *
 * fragment Model3DFragment on Model3d {
 *   id
 *   alt
 *   mediaContentType
 *   previewImage {
 *     url
 *   }
 *   sources {
 *     url
 *   }
 * }
 *
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *
 * fragment SellingPlanFragment on SellingPlan {
 *   id
 *   description
 *   name
 *   options {
 *     name
 *     value
 *   }
 *   priceAdjustments {
 *     orderCount
 *     adjustmentValue {
 *       ...on SellingPlanFixedAmountPriceAdjustment {
 *         adjustmentAmount {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanFixedPriceAdjustment {
 *         price {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanPercentagePriceAdjustment {
 *         adjustmentPercentage
 *       }
 *     }
 *   }
 *   recurringDeliveries
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *
 * fragment UnitPriceFragment on ProductVariant {
 *   unitPriceMeasurement {
 *     measuredType
 *     quantityUnit
 *     quantityValue
 *     referenceUnit
 *     referenceValue
 *   }
 *   unitPrice {
 *     ...MoneyFragment
 *   }
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 *
 * fragment SellingPlanFragment on SellingPlan {
 *   id
 *   description
 *   name
 *   options {
 *     name
 *     value
 *   }
 *   priceAdjustments {
 *     orderCount
 *     adjustmentValue {
 *       ...on SellingPlanFixedAmountPriceAdjustment {
 *         adjustmentAmount {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanFixedPriceAdjustment {
 *         price {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanPercentagePriceAdjustment {
 *         adjustmentPercentage
 *       }
 *     }
 *   }
 *   recurringDeliveries
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 *```
 */
export const ProductProviderFragment = `
fragment ProductProviderFragment on Product  {
  compareAtPriceRange {
    maxVariantPrice {
      ...MoneyFragment
    }
    minVariantPrice {
      ...MoneyFragment
    }
  }
  descriptionHtml
  handle
  id
  media(first: $numProductMedia) {
    edges {
      node {
        ...MediaFileFragment
      }
    }
  }
  metafields(first: $numProductMetafields) {
    edges {
      node {
        ...MetafieldFragment
      }
    }
  }
  priceRange {
    maxVariantPrice {
      ...MoneyFragment
    }
    minVariantPrice {
      ...MoneyFragment
    }
  }
  title
  variants(first: $numProductVariants) {
    edges {
      node {
        ...VariantFragment
      }
    }
  }
  sellingPlanGroups(first: $numProductSellingPlanGroups) {
    edges {
      node {
        ...SellingPlanGroupsFragment
      }
    }
  }
}


fragment MediaFileFragment on Media {
  ... on MediaImage {
    mediaContentType
    image {
      ...ImageFragment
    }
  }
  ... on Video {
    mediaContentType
    ...VideoFragment
  }
  ... on ExternalVideo {
    mediaContentType
    ...ExternalVideoFragment
  }
  ... on Model3d {
    mediaContentType
    ...Model3DFragment
  }
}


fragment MetafieldFragment on Metafield {
  id
  type
  namespace
  key
  value
  createdAt
  updatedAt
  description
  reference @include(if: $includeReferenceMetafieldDetails) {
    __typename
    ... on MediaImage {
      id
      mediaContentType
      image {
        ...ImageFragment
      }
    }
  }
}

fragment VariantFragment on ProductVariant {
  id
  title
  availableForSale
  image {
    ...ImageFragment
  }
  ...UnitPriceFragment
  priceV2 {
    ...MoneyFragment
  }
  compareAtPriceV2 {
    ...MoneyFragment
  }
  selectedOptions {
    name
    value
  }
  metafields(first: $numProductVariantMetafields) {
    edges {
      node {
        ...MetafieldFragment
      }
    }
  }
  sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
    edges {
      node {
        priceAdjustments {
          compareAtPrice {
            ...MoneyFragment
          }
          perDeliveryPrice {
            ...MoneyFragment
          }
          price {
            ...MoneyFragment
          }
          unitPrice {
            ...MoneyFragment
          }
        }
        sellingPlan {
          ...SellingPlanFragment
        }
      }
    }
  }
}


fragment SellingPlanGroupsFragment on SellingPlanGroup {
  sellingPlans(first:$numProductSellingPlans) {
    edges {
      node {
        ...SellingPlanFragment
      }
    }
  }
  appName
  name
  options {
    name
    values
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

fragment VideoFragment on Video {
  id
  previewImage {
    url
  }
  sources {
    mimeType
    url
  }
}

fragment ExternalVideoFragment on ExternalVideo {
  id
  embedUrl
  host
}

fragment Model3DFragment on Model3d {
  id
  alt
  mediaContentType
  previewImage {
    url
  }
  sources {
    url
  }
}

fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}


fragment SellingPlanFragment on SellingPlan {
  id
  description
  name
  options {
    name
    value
  }
  priceAdjustments {
    orderCount
    adjustmentValue {
      ...on SellingPlanFixedAmountPriceAdjustment {
        adjustmentAmount {
          ...MoneyFragment
        }
      }
      ...on SellingPlanFixedPriceAdjustment {
        price {
          ...MoneyFragment
        }
      }
      ...on SellingPlanPercentagePriceAdjustment {
        adjustmentPercentage
      }
    }
  }
  recurringDeliveries
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


fragment UnitPriceFragment on ProductVariant {
  unitPriceMeasurement {
    measuredType
    quantityUnit
    quantityValue
    referenceUnit
    referenceValue
  }
  unitPrice {
    ...MoneyFragment
  }
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}

fragment SellingPlanFragment on SellingPlan {
  id
  description
  name
  options {
    name
    value
  }
  priceAdjustments {
    orderCount
    adjustmentValue {
      ...on SellingPlanFixedAmountPriceAdjustment {
        adjustmentAmount {
          ...MoneyFragment
        }
      }
      ...on SellingPlanFixedPriceAdjustment {
        price {
          ...MoneyFragment
        }
      }
      ...on SellingPlanPercentagePriceAdjustment {
        adjustmentPercentage
      }
    }
  }
  recurringDeliveries
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}`;

/**
 *```
 *
 * fragment UnitPriceFragment on ProductVariant {
 *   unitPriceMeasurement {
 *     measuredType
 *     quantityUnit
 *     quantityValue
 *     referenceUnit
 *     referenceValue
 *   }
 *   unitPrice {
 *     ...MoneyFragment
 *   }
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 *```
 */
export const UnitPriceFragment = `
fragment UnitPriceFragment on ProductVariant {
  unitPriceMeasurement {
    measuredType
    quantityUnit
    quantityValue
    referenceUnit
    referenceValue
  }
  unitPrice {
    ...MoneyFragment
  }
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}`;

/**
*```
* fragment VideoFragment on Video {
*   id
*   previewImage {
*     url
*   }
*   sources {
*     mimeType
*     url
*   }
* }
* 

*```
*/
export const VideoFragment = `fragment VideoFragment on Video {
  id
  previewImage {
    url
  }
  sources {
    mimeType
    url
  }
}

`;

/**
 *```
 *
 * fragment SellingPlanFragment on SellingPlan {
 *   id
 *   description
 *   name
 *   options {
 *     name
 *     value
 *   }
 *   priceAdjustments {
 *     orderCount
 *     adjustmentValue {
 *       ...on SellingPlanFixedAmountPriceAdjustment {
 *         adjustmentAmount {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanFixedPriceAdjustment {
 *         price {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanPercentagePriceAdjustment {
 *         adjustmentPercentage
 *       }
 *     }
 *   }
 *   recurringDeliveries
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 *```
 */
export const SellingPlanFragment = `
fragment SellingPlanFragment on SellingPlan {
  id
  description
  name
  options {
    name
    value
  }
  priceAdjustments {
    orderCount
    adjustmentValue {
      ...on SellingPlanFixedAmountPriceAdjustment {
        adjustmentAmount {
          ...MoneyFragment
        }
      }
      ...on SellingPlanFixedPriceAdjustment {
        price {
          ...MoneyFragment
        }
      }
      ...on SellingPlanPercentagePriceAdjustment {
        adjustmentPercentage
      }
    }
  }
  recurringDeliveries
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}`;

/**
 *```
 *
 * fragment SellingPlanGroupsFragment on SellingPlanGroup {
 *   sellingPlans(first:$numProductSellingPlans) {
 *     edges {
 *       node {
 *         ...SellingPlanFragment
 *       }
 *     }
 *   }
 *   appName
 *   name
 *   options {
 *     name
 *     values
 *   }
 * }
 *
 * fragment SellingPlanFragment on SellingPlan {
 *   id
 *   description
 *   name
 *   options {
 *     name
 *     value
 *   }
 *   priceAdjustments {
 *     orderCount
 *     adjustmentValue {
 *       ...on SellingPlanFixedAmountPriceAdjustment {
 *         adjustmentAmount {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanFixedPriceAdjustment {
 *         price {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanPercentagePriceAdjustment {
 *         adjustmentPercentage
 *       }
 *     }
 *   }
 *   recurringDeliveries
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 *```
 */
export const SellingPlanGroupsFragment = `
fragment SellingPlanGroupsFragment on SellingPlanGroup {
  sellingPlans(first:$numProductSellingPlans) {
    edges {
      node {
        ...SellingPlanFragment
      }
    }
  }
  appName
  name
  options {
    name
    values
  }
}

fragment SellingPlanFragment on SellingPlan {
  id
  description
  name
  options {
    name
    value
  }
  priceAdjustments {
    orderCount
    adjustmentValue {
      ...on SellingPlanFixedAmountPriceAdjustment {
        adjustmentAmount {
          ...MoneyFragment
        }
      }
      ...on SellingPlanFixedPriceAdjustment {
        price {
          ...MoneyFragment
        }
      }
      ...on SellingPlanPercentagePriceAdjustment {
        adjustmentPercentage
      }
    }
  }
  recurringDeliveries
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}`;

/**
 *```
 *
 * fragment VariantFragment on ProductVariant {
 *   id
 *   title
 *   availableForSale
 *   image {
 *     ...ImageFragment
 *   }
 *   ...UnitPriceFragment
 *   priceV2 {
 *     ...MoneyFragment
 *   }
 *   compareAtPriceV2 {
 *     ...MoneyFragment
 *   }
 *   selectedOptions {
 *     name
 *     value
 *   }
 *   metafields(first: $numProductVariantMetafields) {
 *     edges {
 *       node {
 *         ...MetafieldFragment
 *       }
 *     }
 *   }
 *   sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
 *     edges {
 *       node {
 *         priceAdjustments {
 *           compareAtPrice {
 *             ...MoneyFragment
 *           }
 *           perDeliveryPrice {
 *             ...MoneyFragment
 *           }
 *           price {
 *             ...MoneyFragment
 *           }
 *           unitPrice {
 *             ...MoneyFragment
 *           }
 *         }
 *         sellingPlan {
 *           ...SellingPlanFragment
 *         }
 *       }
 *     }
 *   }
 * }
 *
 *
 * fragment SellingPlanFragment on SellingPlan {
 *   id
 *   description
 *   name
 *   options {
 *     name
 *     value
 *   }
 *   priceAdjustments {
 *     orderCount
 *     adjustmentValue {
 *       ...on SellingPlanFixedAmountPriceAdjustment {
 *         adjustmentAmount {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanFixedPriceAdjustment {
 *         price {
 *           ...MoneyFragment
 *         }
 *       }
 *       ...on SellingPlanPercentagePriceAdjustment {
 *         adjustmentPercentage
 *       }
 *     }
 *   }
 *   recurringDeliveries
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment ImageFragment on Image {
 *   id
 *   url
 *   altText
 *   width
 *   height
 * }
 *
 *
 * fragment UnitPriceFragment on ProductVariant {
 *   unitPriceMeasurement {
 *     measuredType
 *     quantityUnit
 *     quantityValue
 *     referenceUnit
 *     referenceValue
 *   }
 *   unitPrice {
 *     ...MoneyFragment
 *   }
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 * fragment MoneyFragment on MoneyV2 {
 *   currencyCode
 *   amount
 * }
 *```
 */
export const VariantFragment = `
fragment VariantFragment on ProductVariant {
  id
  title
  availableForSale
  image {
    ...ImageFragment
  }
  ...UnitPriceFragment
  priceV2 {
    ...MoneyFragment
  }
  compareAtPriceV2 {
    ...MoneyFragment
  }
  selectedOptions {
    name
    value
  }
  metafields(first: $numProductVariantMetafields) {
    edges {
      node {
        ...MetafieldFragment
      }
    }
  }
  sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
    edges {
      node {
        priceAdjustments {
          compareAtPrice {
            ...MoneyFragment
          }
          perDeliveryPrice {
            ...MoneyFragment
          }
          price {
            ...MoneyFragment
          }
          unitPrice {
            ...MoneyFragment
          }
        }
        sellingPlan {
          ...SellingPlanFragment
        }
      }
    }
  }
}


fragment SellingPlanFragment on SellingPlan {
  id
  description
  name
  options {
    name
    value
  }
  priceAdjustments {
    orderCount
    adjustmentValue {
      ...on SellingPlanFixedAmountPriceAdjustment {
        adjustmentAmount {
          ...MoneyFragment
        }
      }
      ...on SellingPlanFixedPriceAdjustment {
        price {
          ...MoneyFragment
        }
      }
      ...on SellingPlanPercentagePriceAdjustment {
        adjustmentPercentage
      }
    }
  }
  recurringDeliveries
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


fragment UnitPriceFragment on ProductVariant {
  unitPriceMeasurement {
    measuredType
    quantityUnit
    quantityValue
    referenceUnit
    referenceValue
  }
  unitPrice {
    ...MoneyFragment
  }
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}`;

export const DefaultPageSeoFragment = `
fragment DefaultPageSeoFragment on Shop {
  title: name
  description
}`;

export const HomeSeoFragment = `
fragment HomeSeoFragment on Shop {
  title: name
  description
}`;

export const ProductSeoFragment = `
fragment ProductSeoFragment on Product {
  title
  description
  seo {
    ...SeoFragment
  }
  vendor
  featuredImage {
    ...ImageSeoFragment
  }
  variants(first: $numProductVariants) {
    edges {
      node {
        image {
          url
        }
        availableForSale
        priceV2 {
          amount
          currencyCode
        }
        sku
      }
    }
  }
}

fragment ImageSeoFragment on Image {
  url
  width
  height
  altText
}

fragment SeoFragment on SEO {
  description
  title
}`;

export const CollectionSeoFragment = `
fragment CollectionSeoFragment on Collection {
  title
  description
  seo {
    ...SeoFragment
  }
  image {
    ...ImageSeoFragment
  }
}
fragment ImageSeoFragment on Image {
  url
  width
  height
  altText
}

fragment SeoFragment on SEO {
  description
  title
}`;

export const PageSeoFragment = `
fragment PageSeoFragment on Page {
  title
  seo {
    ...SeoFragment
  }
}

fragment SeoFragment on SEO {
  description
  title
}`;

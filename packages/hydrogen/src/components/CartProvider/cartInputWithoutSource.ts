import {
  CartLineInput,
  CartBuyerIdentityInput,
  InputMaybe,
  AttributeInput,
  Scalars
} from '../../storefront-api-types.js';

/**
 * User input for CartCreate mutation without the `source_name`.
 */
 export interface CartInputWithoutSource {
  /** An array of key-value pairs that contains additional information about the cart. */
  attributes?: InputMaybe<Array<AttributeInput>>;
  /** The customer associated with the cart. Used to determine [international pricing](https://shopify.dev/api/examples/international-pricing#create-a-checkout). Buyer identity should match the customer's shipping address. */
  buyerIdentity?: InputMaybe<CartBuyerIdentityInput>;
  /**
   * The unique identifier of a partner checkout channel configuration.
   *
   * This field is used to indicate a channel checkout settings to be used for checkout customization.
   *
   */
  checkoutChannelConfigurationHandle?: InputMaybe<Scalars['String']>;
  /**
   * The case-insensitive discount codes that the customer added at checkout.
   *
   */
  discountCodes?: InputMaybe<Array<Scalars['String']>>;
  /** A list of merchandise lines to add to the cart. */
  lines?: InputMaybe<Array<CartLineInput>>;
  /** A note that is associated with the cart. For example, the note can be a personalized message to the buyer. */
  note?: InputMaybe<Scalars['String']>;
}

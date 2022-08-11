/* global Oxygen */
import {
  OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE,
  STOREFRONT_API_SECRET_TOKEN_HEADER,
  STOREFRONT_API_PUBLIC_TOKEN_HEADER,
  STOREFRONT_API_BUYER_IP_HEADER,
  SHOPIFY_STOREFRONT_ID_VARIABLE,
  SHOPIFY_STOREFRONT_ID_HEADER,
} from '../constants.js';

export function getStorefrontApiRequestHeaders({
  buyerIp,
  storefrontToken,
}: {
  buyerIp?: string | null;
  storefrontToken: string;
}) {
  const headers = {} as Record<string, any>;

  const secretToken = getOxygenVariable(
    OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE
  );

  // temp log, waiting for mini-oxygen env vars fix
  console.log('secretToken', secretToken);

  const storefrontId = getOxygenVariable(SHOPIFY_STOREFRONT_ID_VARIABLE);

  /**
   * Only pass one type of storefront token at a time.
   */
  if (secretToken) {
    headers[STOREFRONT_API_SECRET_TOKEN_HEADER] = secretToken;
  } else {
    headers[STOREFRONT_API_PUBLIC_TOKEN_HEADER] = storefrontToken;
  }

  if (buyerIp) {
    headers[STOREFRONT_API_BUYER_IP_HEADER] = buyerIp;
  }

  if (storefrontId) {
    headers[SHOPIFY_STOREFRONT_ID_HEADER] = storefrontId;
  }

  return headers;
}

export function getOxygenVariable(key: string): any {
  return typeof Oxygen !== 'undefined' ? Oxygen?.env?.[key] : null;
}

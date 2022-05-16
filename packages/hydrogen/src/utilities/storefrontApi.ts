/* global Oxygen */
import {
  OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE,
  STOREFRONT_API_SECRET_TOKEN_HEADER,
  STOREFRONT_API_PUBLIC_TOKEN_HEADER,
  STOREFRONT_API_BUYER_IP_HEADER,
} from '../constants';

export function getStorefrontApiRequestHeaders({
  buyerIp,
  storefrontToken,
}: {
  buyerIp?: string | null;
  storefrontToken: string;
}) {
  const headers = {} as Record<string, any>;

  const secretToken =
    typeof Oxygen !== 'undefined'
      ? Oxygen?.env?.[OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE]
      : null;

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

  return headers;
}

/* global Oxygen */
import {
  OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE,
  STOREFRONT_API_SECRET_TOKEN_HEADER,
  STOREFRONT_API_PUBLIC_TOKEN_HEADER,
  STOREFRONT_API_BUYER_IP_HEADER,
  SHOPIFY_STOREFRONT_ID_VARIABLE,
  SHOPIFY_STOREFRONT_ID_HEADER,
} from '../constants.js';
import {log} from './log/log.js';

let secretTokenWarned = false;
let storefrontIdWarned = false;

export function getStorefrontApiRequestHeaders({
  buyerIp,
  storefrontToken,
  secretToken,
  storefrontId,
}: {
  buyerIp?: string | null;
  storefrontToken: string;
  secretToken: string | undefined;
  storefrontId: string | undefined;
}) {
  const headers = {} as Record<string, any>;

  if (!secretToken && !secretTokenWarned) {
    secretTokenWarned = true;
    secretToken = getOxygenVariable(OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE);

    if (!secretToken && !__HYDROGEN_DEV__) {
      log.error(
        'No secret Shopify storefront API token was defined. This means your app will be rate limited!\nSee how to add the token: '
      );
    } else if (secretToken) {
      log.warn(
        'The private shopify storefront API token was loaded implicitly by an environment variable. This is deprecated, and instead the variable should be defined directly in the Hydrogen Config.\nFor more information: '
      );
    }
  }

  if (!storefrontId && !storefrontIdWarned) {
    storefrontIdWarned = true;
    storefrontId = getOxygenVariable(SHOPIFY_STOREFRONT_ID_VARIABLE);

    if (!storefrontId && !__HYDROGEN_DEV__) {
      log.warn(
        'No storefrontId was defined. This means the analytics on your admin dashboard will be broken!\nSee how to fix it: '
      );
    } else if (storefrontId) {
      log.warn(
        'The storefrontId was loaded implicitly by an environment variable. This is deprecated, and instead the variable should be defined directly in the Hydrogen Config.\nFor more information: '
      );
    }
  }

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

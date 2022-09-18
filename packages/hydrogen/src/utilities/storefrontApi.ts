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
  publicStorefrontToken,
  privateStorefrontToken,
  storefrontId,
}: {
  buyerIp?: string | null;
  publicStorefrontToken: string;
  privateStorefrontToken: string | undefined;
  storefrontId: string | undefined;
}) {
  const headers = {} as Record<string, any>;

  if (!privateStorefrontToken) {
    privateStorefrontToken = getOxygenVariable(
      OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE
    );

    if (!secretTokenWarned) {
      secretTokenWarned = true;

      if (!privateStorefrontToken && !__HYDROGEN_DEV__) {
        log.error(
          'No secret Shopify storefront API token was defined. This means your app will be rate limited!\nSee how to add the token: '
        );
      } else if (privateStorefrontToken) {
        log.warn(
          'The private shopify storefront API token was loaded implicitly by an environment variable. This is deprecated, and instead the variable should be defined directly in the Hydrogen Config.\nFor more information: '
        );
      }
    }
  }

  if (!storefrontId) {
    storefrontId = getOxygenVariable(SHOPIFY_STOREFRONT_ID_VARIABLE);

    if (!storefrontIdWarned) {
      storefrontIdWarned = true;
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
  }

  /**
   * Only pass one type of storefront token at a time.
   */
  if (privateStorefrontToken) {
    headers[STOREFRONT_API_SECRET_TOKEN_HEADER] = privateStorefrontToken;
  } else {
    headers[STOREFRONT_API_PUBLIC_TOKEN_HEADER] = publicStorefrontToken;
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

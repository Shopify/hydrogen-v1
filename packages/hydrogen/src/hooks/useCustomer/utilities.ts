import {SessionApi} from '../../foundation/session/session';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from './constants';
import type {CustomerAccessToken} from '../../storefront-api-types';

// Assumptions:
// 1. setCustomerAccessToken & removeCustomerAccessToken only being use in api routes

export async function setCustomerAccessToken(
  session: SessionApi,
  {accessToken, expiresAt}: CustomerAccessToken
) {
  await session.set(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, accessToken);
}

export async function removeCustomerAccessToken(session: SessionApi) {
  await session.set(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, '');
}

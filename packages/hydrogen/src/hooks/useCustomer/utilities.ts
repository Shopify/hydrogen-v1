import {SessionApi} from '../../foundation/session/session';

import {
  CUSTOMER_ACCESS_TOKEN_COOKIE_NAME,
  CUSTOMER_ACCESS_TOKEN_EXPIRE_NAME,
  CUSTOMER_ACCESS_TOKEN_REMEMBER_NAME,
} from './constants';
import type {CustomerAccessToken} from '../../storefront-api-types';

// Assumptions:
// setCustomerAccessToken & removeCustomerAccessToken only being use in api routes

export async function setCustomerAccessToken(
  session: SessionApi,
  {accessToken, expiresAt}: CustomerAccessToken,
  remembered = false
) {
  await session.set(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, accessToken);
  await session.set(
    CUSTOMER_ACCESS_TOKEN_EXPIRE_NAME,
    new Date(expiresAt).toISOString()
  );

  if (remembered) {
    await session.set(
      CUSTOMER_ACCESS_TOKEN_REMEMBER_NAME,
      remembered.toString()
    );
  }
}

export async function removeCustomerAccessToken(session: SessionApi) {
  await session.set(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, '');
  await session.set(CUSTOMER_ACCESS_TOKEN_EXPIRE_NAME, '');
  await session.set(CUSTOMER_ACCESS_TOKEN_REMEMBER_NAME, '');
}

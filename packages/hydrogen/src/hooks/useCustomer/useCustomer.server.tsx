import {useSession} from '../../foundation/useSession/useSession';
import {
  CUSTOMER_ACCESS_TOKEN_COOKIE_NAME,
  CUSTOMER_ACCESS_TOKEN_EXPIRE_NAME,
  CUSTOMER_ACCESS_TOKEN_REMEMBER_NAME,
} from './constants';

const ONE_DAY = 86400000;

type AccessToken = string | undefined;

export function useCustomer(
  renewToken?: (accessToken: AccessToken) => AccessToken
): AccessToken {
  const session = useSession();

  let accessToken;
  let expiresAt;
  let remembered;

  if (session) {
    accessToken = session[CUSTOMER_ACCESS_TOKEN_COOKIE_NAME];

    expiresAt = session[CUSTOMER_ACCESS_TOKEN_EXPIRE_NAME];
    if (expiresAt && expiresAt !== '') {
      expiresAt = new Date(expiresAt);
    }

    remembered = session[CUSTOMER_ACCESS_TOKEN_REMEMBER_NAME];
    remembered = remembered === 'true';
  }

  // if accessToken does not exist, returned undefined
  if (!accessToken || accessToken === '') {
    return;
  }

  // if accessToken exist, check expiry
  if (expiresAt instanceof Date && expiresAt.getTime() - Date.now() > 0) {
    return accessToken;
  }

  // if remembered is checked, refreshToken callback is provided, and accessToken is 1 day away from expire,
  // get token again
  if (
    typeof remembered === 'boolean' &&
    renewToken &&
    expiresAt instanceof Date &&
    expiresAt.getTime() - Date.now() <= ONE_DAY
  ) {
    // get token again
    return renewToken(accessToken);
  }

  return;
}

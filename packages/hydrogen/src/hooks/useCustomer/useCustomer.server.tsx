import {useSession} from '../../foundation/useSession/useSession';
import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from './constants';

export function useCustomer(): string | undefined {
  const session = useSession();

  let accessToken;

  if (session) {
    accessToken = session[CUSTOMER_ACCESS_TOKEN_COOKIE_NAME];
  }

  return accessToken;
}

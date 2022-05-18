import {useSession} from '../../foundation/useSession/useSession';
import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from './constants';

/**
 * The `useCustomer` hook returns the customer access token of the currently logged in user.
 * If there is no logged in user, returns `undefined`.
 */
export function useCustomer(): string | undefined {
  const session = useSession();
  return session[CUSTOMER_ACCESS_TOKEN_COOKIE_NAME];
}

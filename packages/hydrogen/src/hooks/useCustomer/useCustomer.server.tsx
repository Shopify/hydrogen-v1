import {useSession} from '../../foundation/useSession/useSession';
import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from './constants';

type Customer = {
  customerAccessToken?: string;
};

/**
 * The `useCustomer` hook returns an object representing the currently logged in user.
 * It should only be used within server components.
 */
export function useCustomer(): Customer {
  const session = useSession();
  return {customerAccessToken: session[CUSTOMER_ACCESS_TOKEN_COOKIE_NAME]};
}

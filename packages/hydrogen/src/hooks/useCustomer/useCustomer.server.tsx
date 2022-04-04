import {useServerRequest} from '../../foundation/ServerRequestProvider';
import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from './constants';

export function useCustomer(): string | undefined {
  const {cookies} = useServerRequest();

  let accessToken;

  if (cookies) {
    accessToken = cookies.get(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME);
  }

  return accessToken;
}

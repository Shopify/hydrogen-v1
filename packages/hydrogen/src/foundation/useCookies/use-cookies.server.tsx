import {useServerRequest} from '../ServerRequestProvider';

export function useCookies() {
  const {cookies} = useServerRequest();

  if (!cookies) {
    throw new Error('No Cookies found');
  }

  return cookies;
}

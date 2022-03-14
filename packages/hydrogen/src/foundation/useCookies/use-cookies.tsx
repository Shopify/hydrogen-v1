import {useEnvContext} from '../ssr-interop';

export function useCookies() {
  const cookies = useEnvContext((req) => req.cookies);

  if (!cookies) {
    throw new Error('No Cookies found');
  }

  return cookies;
}

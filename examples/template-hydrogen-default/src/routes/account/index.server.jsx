import {CacheCustom, useCookies} from '@shopify/hydrogen';

import AccountDetails from '../../components/AccountDetails.server';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants/cookies';

export default function Account({response}) {
  // disabled full page cache
  response.cache(
    CacheCustom({
      mode: 'no-store',
    }),
  );

  const cookies = useCookies();

  const customerAccessToken = cookies.get(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME);

  if (customerAccessToken) {
    return <AccountDetails customerAccessToken={customerAccessToken} />;
  } else {
    response.redirect('/account/login');
  }
}

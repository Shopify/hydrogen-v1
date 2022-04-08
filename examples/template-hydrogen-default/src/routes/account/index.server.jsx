import {CacheCustom, useSession} from '@shopify/hydrogen';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants';
import AccountDetails from '../../components/AccountDetails.server';

export default function Account({response}) {
  const sessionData = useSession();

  // disabled full page cache
  response.cache(
    CacheCustom({
      mode: 'no-store',
    }),
  );

  const customerAccessToken = sessionData?.[CUSTOMER_ACCESS_TOKEN_COOKIE_NAME];

  if (customerAccessToken) {
    return <AccountDetails customerAccessToken={customerAccessToken} />;
  } else {
    return response.redirect('/account/login');
  }
}

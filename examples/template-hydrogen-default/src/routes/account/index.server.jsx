import {CacheCustom, useSession} from '@shopify/hydrogen';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants';
import AccountDetails from '../../components/AccountDetails.server';

export default function Account({response}) {
  const session = useSession();

  // disabled full page cache
  response.cache(
    CacheCustom({
      mode: 'no-store',
    }),
  );

  const customerAccessToken = session
    ? session.get()[CUSTOMER_ACCESS_TOKEN_COOKIE_NAME]
    : undefined;

  if (customerAccessToken) {
    return <AccountDetails customerAccessToken={customerAccessToken} />;
  } else {
    return response.redirect('/account/login');
  }
}

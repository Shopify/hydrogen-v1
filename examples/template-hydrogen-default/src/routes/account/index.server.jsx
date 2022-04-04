import {CacheCustom, useCustomer} from '@shopify/hydrogen';

import AccountDetails from '../../components/AccountDetails.server';

export default function Account({response}) {
  // disabled full page cache
  response.cache(
    CacheCustom({
      mode: 'no-store',
    }),
  );

  const customerAccessToken = useCustomer();

  if (customerAccessToken) {
    return <AccountDetails customerAccessToken={customerAccessToken} />;
  } else {
    return response.redirect('/account/login');
  }
}

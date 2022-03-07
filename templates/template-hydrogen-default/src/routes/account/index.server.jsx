import {CacheCustom, useCustomer, useShop} from '@shopify/hydrogen';

import AccountDetails from '../../components/AccountDetails.server';

export default function Account({response}) {
  // not very safe that multipassToken comes from useShop, need to restric it to server
  const {multipassSecret} = useShop();

  // disabled full page cache
  response.cache(
    CacheCustom({
      mode: 'no-store',
    }),
  );

  const customerAccessToken = useCustomer();

  if (!customerAccessToken && multipassSecret) {
    return response.redirect(
      '/api/login-multipass?returnurl=/account&failurl=/account/login',
    );
  }

  if (customerAccessToken && customerAccessToken !== '') {
    return <AccountDetails customerAccessToken={customerAccessToken} />;
  } else {
    return response.redirect('/account/login');
  }
}

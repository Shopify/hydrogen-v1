import {useSession, NoStore} from '@shopify/hydrogen';

import AccountDetails from '../../components/account/AccountDetails.server';

export default function Account({response}) {
  response.cache(NoStore());

  const {customerAccessToken} = useSession();

  if (customerAccessToken && customerAccessToken !== '') {
    return <AccountDetails customerAccessToken={customerAccessToken} />;
  } else {
    return response.redirect('/account/login');
  }
}

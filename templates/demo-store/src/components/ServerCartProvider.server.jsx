import {useSession} from '@shopify/hydrogen';
import LocalCartProvider from './LocalCartProvider.client';

export default function ServerCartProvider({children}) {
  const {customerAccessToken} = useSession();

  return (
    <LocalCartProvider customerAccessToken={customerAccessToken}>
      {children}
    </LocalCartProvider>
  );
}

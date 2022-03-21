/** Server component example */

import {useRouteParams} from '@shopify/hydrogen';
// Server component
export default function Page() {
  const {handle} = useRouteParams();
  return <h1>The handle route param is: {handle}</h1>;
}

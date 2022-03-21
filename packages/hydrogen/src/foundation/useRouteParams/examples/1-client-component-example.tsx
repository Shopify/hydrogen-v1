/** Client component example */

import {useRouteParams} from '@shopify/hydrogen/client';
// Client component
export default function Component() {
  const {handle} = useRouteParams();
  return <h1>The handle route param is: {handle}</h1>;
}

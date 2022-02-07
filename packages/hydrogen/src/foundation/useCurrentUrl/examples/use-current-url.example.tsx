import {useCurrentUrl} from '@shopify/hydrogen';

export default function Page() {
  const url = useCurrentUrl();

  return <h1>Current Url is: {url.href}</h1>;
}

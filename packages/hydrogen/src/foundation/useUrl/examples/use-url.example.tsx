import {useUrl} from '@shopify/hydrogen';

export default function Page() {
  const url = useUrl();

  return <h1>Current Url is: {url.href}</h1>;
}

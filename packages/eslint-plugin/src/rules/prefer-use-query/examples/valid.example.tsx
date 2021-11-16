// Examples of **correct** code for this rule:

import {useQuery} from '@shopify/hydrogen';

export default function Page() {
  const {data} = useQuery(['unique', 'key'], async () => {
    const response = await fetch('https://my.api.com');

    return await response.json();
  });

  return <h1>{data.title}</h1>;
}

import {fetchSync} from '@shopify/hydrogen/client';

function Greeting() {
  const {data} = fetchSync('http://localhost:3000/api/graphql', {
    method: 'POST',
    body: JSON.stringify({query: `{hello}`}),
  }).json();

  return <div>{data.hello}</div>;
}

export default Greeting;

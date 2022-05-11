import {useQuery} from '@shopify/hydrogen';

export default function Page() {
  const {
    data: {data},
  } = useQuery(['home', 'hello-world'], async () => {
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query: `{hello}`}),
    });

    return await response.json();
  });

  console.log(data);

  return <p>{data.hello}</p>;
}

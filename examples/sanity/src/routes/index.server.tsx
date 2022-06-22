import {useSanityQuery} from '../../hooks/useSanityQuery';

export default function Home() {
  const {data = []} = useSanityQuery({
    hydrogenQueryOptions: {preload: true},
    query: `*[_type == "product"]`,
  });

  return (
    <main>
      <h1>Products</h1>
      {data.length > 0 && (
        <ul>
          {data?.map(({store}: {store: any}) => (
            <li key={store?.id}>
              <a href={`/products/${store?.slug?.current}`}>{store?.title}</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

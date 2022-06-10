import { useSanityQuery } from '../../hooks/useSanityQuery';

type IndexPage = {
  store: {
    id: string;
    gid: string;
    title?: string;
    slug?: {
      current: string;
    }
  }
}

export default function Home() {
  const { data = [] } = useSanityQuery<IndexPage[]>({
    hydrogenQueryOptions: { preload: true},
    query: `*[_type == "product"]`
  })

  return <main>
    <h1>Products</h1>
    {data.length > 0 && (<ul>
      {data?.map(({store}) => <li key={store?.id}><a href={`/products/${store?.slug?.current}`}>{store?.title}</a></li>)}
    </ul>)}
  </main>;
}

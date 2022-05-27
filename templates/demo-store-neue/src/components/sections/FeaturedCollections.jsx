import {Link, Image} from '@shopify/hydrogen';
import {Heading} from '../elements';

const dummyCollections = [
  {
    id: '1',
    url: '/',
    image: 'https://picsum.photos/seed/3/912',
    title: 'Bath',
  },
  {
    id: '2',
    url: '/',
    image: 'https://picsum.photos/seed/4/912',
    title: 'Swim',
  },
  {
    id: '3',
    url: '/',
    image: 'https://picsum.photos/seed/5/912',
    title: 'Gifts',
  },
];

// TODO: This should be consolidated with Locations into a more generic presentational component

export default function FeaturedCollections({
  title = 'Collections',
  collections = dummyCollections,
}) {
  return (
    <section className="grid gap-6 p-m md:p-l lg:p-xl bg-primary/20">
      <Heading size="lead">{title}</Heading>
      <ul className="grid md:grid-cols-3 gap-m">
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link to={collection.url}>
              <div className="grid gap-m">
                <div className="">
                  <Image
                    className="rounded shadow-border overflow-clip inline-block aspect-square md:aspect-[4/3] object-cover"
                    width={'100%'}
                    height={336}
                    alt={`Image of ${collection.title}`}
                    src={collection.image}
                  />
                </div>
                <Heading size="copy">{collection.title}</Heading>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import Section from './Section';
import {Link, Image} from '@shopify/hydrogen';
import {Heading, Grid} from '~/components/elements';

const mockCollections = [
  {
    id: '1',
    url: '/collections/freestyle-collection',
    image: 'https://picsum.photos/seed/3/912',
    title: 'Bath',
  },
  {
    id: '2',
    url: '/collections/freestyle-collection',
    image: 'https://picsum.photos/seed/4/912',
    title: 'Swim',
  },
  {
    id: '3',
    url: '/collections/freestyle-collection',
    image: 'https://picsum.photos/seed/5/912',
    title: 'Gifts',
  },
];

// TODO: This should be consolidated with Locations into a more generic presentational component

export default function FeaturedCollections({
  title = 'Collections',
  collections = mockCollections,
}) {
  return (
    <Section heading={title}>
      <Grid items={collections.length}>
        {collections.map((collection) => (
          <Link key={collection.id} to={collection.url}>
            <div className="grid gap-m">
              <Image
                className="rounded shadow-border overflow-clip inline-block aspect-square md:aspect-[4/3] object-cover"
                width={'100%'}
                height={336}
                alt={`Image of ${collection.title}`}
                src={collection.image}
              />
              <Heading size="copy">{collection.title}</Heading>
            </div>
          </Link>
        ))}
      </Grid>
    </Section>
  );
}

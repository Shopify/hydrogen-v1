import Section from './Section';
import {Link, Image} from '@shopify/hydrogen';
import {Heading, Grid} from '~/components/elements';

// TODO: This should be consolidated with Locations into a more generic presentational component

export default function FeaturedCollections({
  data,
  title = 'Collections',
  passthroughProps,
}) {
  return (
    <Section heading={title} {...passthroughProps}>
      <Grid items={data.length}>
        {data.map((collection) => (
          <Link key={collection.id} to={`/collections/${collection.handle}`}>
            <div className="grid gap-4">
              {collection?.image && (
                <Image
                  className="rounded shadow-border overflow-clip inline-block aspect-[5/4] md:aspect-[3/2] object-cover"
                  width={'100%'}
                  height={336}
                  alt={`Image of ${collection.title}`}
                  data={collection.image}
                />
              )}
              <Heading size="copy">{collection.title}</Heading>
            </div>
          </Link>
        ))}
      </Grid>
    </Section>
  );
}

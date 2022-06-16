import {Link, Image} from '@shopify/hydrogen';

import {Heading, Section, Grid} from '~/components';

export function FeaturedCollections({data, title = 'Collections', ...props}) {
  const items = data.filter((item) => item.image).length;
  const haveCollections = data.length > 0;

  if (!haveCollections) return null;

  return (
    <Section {...props} heading={title}>
      <Grid items={items}>
        {data.map((collection) => {
          if (!collection?.image) {
            return null;
          }
          return (
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
          );
        })}
      </Grid>
    </Section>
  );
}

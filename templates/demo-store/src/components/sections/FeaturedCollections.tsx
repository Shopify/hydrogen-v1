import {Link, Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {Heading, Section, Grid} from '~/components';

export function FeaturedCollections({
  data,
  title = 'Collections',
  ...props
}: {
  data: Collection[];
  title?: string;
  [key: string]: any;
}) {
  const items = data.filter((item) => item.image).length;

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
                    width={500}
                    height={400}
                    widths={[400, 500, 600, 700, 800, 900]}
                    sizes="(max-width: 32em) 100vw, 33vw"
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

import {Image, Link} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {Heading} from '~/components';

export function CollectionCard({
  collection,
  loading,
}: {
  collection: Collection;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <Link to={`/collections/${collection.handle}`} className="grid gap-4">
      {collection?.image && (
        <div className="card-image">
          <Image
            alt={collection.image.altText || collection.title}
            className="object-cover w-full aspect-[3/2]"
            data={collection.image}
            height={600}
            loading={loading}
            sizes="(min-width: 768px) 50vw, 100vw"
            width={900}
          />
        </div>
      )}
      <Heading as="h3" size="copy">
        {collection.title}
      </Heading>
    </Link>
  );
}

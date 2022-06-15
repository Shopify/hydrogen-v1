import {Image, Link} from '@shopify/hydrogen';

import {Heading} from '~/components';

export function CollectionCard({collection}) {
  return (
    <Link to={`/collections/${collection.handle}`} className="grid gap-4">
      {collection?.image && (
        <div className="card-image">
          <Image
            className="object-cover w-full aspect-[3/2]"
            data={collection.image}
          />
        </div>
      )}
      <Heading as="h3" size="copy">
        {collection.title}
      </Heading>
    </Link>
  );
}

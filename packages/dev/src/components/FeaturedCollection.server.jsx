import {Image, RawHtml} from '@shopify/hydrogen/client';

import StyledLink from './StyledLink';

export default function FeaturedCollection({collection}) {
  return collection ? (
    <div className="mb-14 grid grid-cols-1 lg:grid-cols-2">
      <Image
        width="1024"
        image={collection.image}
        className="border-2 border-black"
      />
      <div className="py-14 px-0 lg:pl-8 lg:pr-14">
        <span className="text-small text-black uppercase tracking-wider font-bold font-mono">
          Featured Collection
        </span>
        <h2 className="text-4xl md:text-5xl text-black font-black my-4">
          {collection.title}
        </h2>
        <RawHtml
          className="text-xl md:text-2xl text-black leading-relaxed mb-4"
          string={collection.descriptionHtml}
        />
        <StyledLink
          url={`/collections/${collection.handle}`}
          value="Shop Collection"
        />
      </div>
    </div>
  ) : null;
}

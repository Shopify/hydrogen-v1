import {Helmet} from '@shopify/hydrogen/client';

import ImageSeo from './ImageSeo.client';
import PageLevelSeo from './PageLevelSeo.client';

export default function CollectionSeo({collection}) {
  if (!collection) {
    return null;
  }

  const title = collection.seo?.title ?? collection.title;
  const description = collection.seo?.description ?? collection.description;

  const image = collection.image;

  return (
    <>
      <PageLevelSeo title={title} description={description} />
      <ImageSeo image={image} />
      <Helmet>
        <meta property="og:type" content="product.group" />
      </Helmet>
    </>
  );
}

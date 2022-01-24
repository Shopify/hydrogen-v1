import {Helmet} from '@shopify/hydrogen/client';

export default function ImageSeo({image}) {
  if (!image) {
    return null;
  }

  return (
    <Helmet>
      <meta property="og:image" content={image.url} />
      <meta property="og:image:secure_url" content={image.url} />
      {image.width && <meta property="og:image:width" content={image.width} />}
      {image.height && (
        <meta property="og:image:height" content={image.height} />
      )}
    </Helmet>
  );
}

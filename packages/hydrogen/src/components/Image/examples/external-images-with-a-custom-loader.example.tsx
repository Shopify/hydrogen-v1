/** External images with a custom loader */

import {Image} from '@shopify/hydrogen';
const imageLoader = (src, options) => {
  const {width, height, scale} = options;
  return `https://foo.com/${src}?w=${width}&h=${height}&scale=${scale}`;
};
export default function ExternalImageWithLoader() {
  return (
    <Image
      src="fancyImage.png"
      width={500}
      height={500}
      loaderOptions={{scale: 2}}
    />
  );
}

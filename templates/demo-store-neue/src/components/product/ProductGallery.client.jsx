import {MediaFile} from '@shopify/hydrogen/client';
import {ATTR_LOADING_EAGER} from '~/lib/const';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media, className}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        if (med.mediaContentType === 'MODEL_3D') {
          extraProps = {
            interactionPromptThreshold: '0',
            ar: true,
            loading: ATTR_LOADING_EAGER,
            disableZoom: true,
          };
        }

        const data = {
          ...med,
          image: {
            ...med.image,
            altText: med.alt || 'Product image',
          },
        };

        if (i === 0 && med.mediaContentType === 'IMAGE') {
          extraProps.loading = ATTR_LOADING_EAGER;
        }

        const style = [
          isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
          isFirst || isFourth ? 'aspect-square' : 'aspect-[4/5]',
          'snap-center card-image bg-white dark:bg-contrast/10  md:w-full w-[80vw]',
        ].join(' ');

        return (
          <div className={style} key={med.id || med.image.id}>
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover`}
              data={data}
              options={{
                crop: 'center',
              }}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}

import {MediaFile} from '@shopify/hydrogen/client';
import type {MediaEdge} from '@shopify/hydrogen/storefront-api-types';
import {ATTR_LOADING_EAGER} from '~/lib/const';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaEdge['node'][];
  className?: string;
}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      {media.map((med, i) => {
        let extraProps: Record<string, any> = {};

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
            // @ts-ignore
            ...med.image,
            altText: med.alt || 'Product image',
          },
        };

        if (i === 0 && med.mediaContentType === 'IMAGE') {
          extraProps.loading = ATTR_LOADING_EAGER;
        }

        return (
          <div
            className={`${
              i % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'
            } snap-center card-image bg-white dark:bg-contrast/10 aspect-square md:w-full w-[80vw]`}
            // @ts-ignore
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover`}
              data={data}
              // @ts-ignore
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

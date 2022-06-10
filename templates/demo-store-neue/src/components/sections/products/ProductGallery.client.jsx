import {MediaFile} from '@shopify/hydrogen/client';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media, className}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`grid grid-flow-col md:grid-flow-row gap-4 px-4 pb-4 overflow-x-scroll snap-x snap-center w-full  md:grid-cols-2 ${className}`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === 'MODEL_3D') {
          extraProps = {
            interactionPromptThreshold: '0',
            ar: true,
            loading: 'eager',
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

        return (
          <div
            className={`${
              i % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'
            } aspect-square md:w-full w-[80vw]`}
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={` w-full h-full aspect-square`}
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

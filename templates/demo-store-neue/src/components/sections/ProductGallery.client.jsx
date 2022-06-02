import {useProduct, MediaFile} from '@shopify/hydrogen/client';
import {Tab} from '@headlessui/react';
import {Fragment, useState} from 'react';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export default function Gallery({className}) {
  const {media} = useProduct();

  if (!media.length) {
    return null;
  }

  return (
    <div className={`w-full grid grid-cols-2 gap-2 md:gap-4 ${className}`}>
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
          alt: med.alt || 'Product image',
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? 'col-span-1 md:col-span-2' : 'col-span-1'
            } aspect-square`}
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={` w-full h-full ${
                med.mediaContentType !== 'MODEL_3D' && 'mix-blend-multiply'
              } aspect-square`}
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

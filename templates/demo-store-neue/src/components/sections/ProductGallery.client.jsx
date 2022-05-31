import {useProduct, MediaFile} from '@shopify/hydrogen/client';
import {Tab} from '@headlessui/react';
import {Fragment, useState} from 'react';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export default function Gallery() {
  const {descriptionHtml, media} = useProduct();
  const [selectedIndex, setSelectedIndex] = useState();

  if (!media.length) {
    return null;
  }

  const featuredMedia = media[1];
  const mediaFiles = media.slice(1);

  let featuredExtraProps = {
    interactionPromptThreshold: '50',
    ar: true,
    loading: 'eager',
    disableZoom: true,
  };

  return (
    <div className="bg-white bg-productPhotos rounded-xl shadow-productPhotos overflow-clip py-10 w-full md:w-[33.5rem] relative grid items-center justify-start">
      {mediaFiles.map((med) => {
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
          <div className="relative" key={med.id || med.image.id}>
            <MediaFile
              tabIndex="0"
              className={`object-scale-down w-full h-full ${
                med.mediaContentType !== 'MODEL_3D' && 'mix-blend-multiply'
              } aspect-square`}
              data={data}
              options={{
                height: '485',
                width: '485',
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

import {Image} from '@shopify/hydrogen/client';

import Button from './Button.client';

export default function CollectionHero({collection}) {
  return collection ? (
    <section className="relative w-full border-b-2 border-black mb-14">
      <div className="absolute h-full w-full grid grid-cols-1 lg:grid-cols-2">
        <div className="w-full h-full md:min-h-96 lg:order-first lg:h-auto">
          <div className="w-full h-full bg-gradient-to-bl from-purple-600 via-blue-500 to-green-300" />
        </div>
        <div className="order-first overflow-hidden border-b-2 lg:border-b-0 lg:border-l-2 border-black">
          <Image
            className="object-cover bg-center h-full w-full"
            image={collection.image}
            options={{
              height: collection.image.height,
              width: collection.image.width,
            }}
          />
        </div>
      </div>
      <div className="h-full mx-auto max-w-7xl">
        <div className="h-full px-4 pt-80 md:px-8 pb-16 md:pt-96 lg:pt-28 lg:pb-32">
          <div className="flex justify-center flex-col h-full md:pt-48 lg:pt-0">
            <div className="w-full lg:max-w-[808px] border-2 border-black bg-white p-7 md:p-14 drop-shadow-lg">
              <p className="uppercase font-mono font-bold text-sm pb-4">
                The Latest
              </p>
              <h2 className="font-black text-4xl md:text-5xl pb-4">
                New Year.
                <span className="text-purple-600 ml-4">New Drop.</span>
              </h2>
              <p className="text-xl md:text-2xl">
                Get the freshest styles from this season&apos;s collection. Our
                most chill collection yet.
              </p>
            </div>
            <Button
              className="md:self-start mt-4 md:mt-8 bg-opacity-50 hover:bg-opacity-50 active:bg-opacity-50"
              label={`Shop ${collection.title.toLowerCase()}`}
              url={`collections/${collection.handle}`}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </section>
  ) : null;
}

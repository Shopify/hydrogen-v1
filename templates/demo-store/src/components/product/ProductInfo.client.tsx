// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Disclosure} from '@headlessui/react';

import {Text, IconClose} from '~/components';
import {getProductInfoPlaceholder} from '~/lib/placeholders';

interface ProductInfo {
  title: string;
  content: string;
  id: string;
}

export function ProductInfo({data}: {data: ProductInfo[]}) {
  const infos = data?.length ? data : getProductInfoPlaceholder();
  if (!Array.isArray(infos)) return null;
  return (
    <section className="grid gap-4 py-4">
      {infos.map((section: ProductInfo) => (
        <Disclosure
          key={section.title}
          as="div"
          id={section.id}
          className="grid w-full gap-2"
        >
          {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
          {({open}) => (
            <>
              <Disclosure.Button className="text-left">
                <div className="flex justify-between">
                  <Text size="lead" as="h4">
                    {section.title}
                  </Text>
                  <IconClose
                    className={`${
                      open ? '' : 'rotate-[45deg]'
                    } transition-transform transform-gpu duration-200`}
                  />
                </div>
              </Disclosure.Button>

              <Disclosure.Panel className={'pb-4'}>
                <Text>{section.content}</Text>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </section>
  );
}

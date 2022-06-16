import {Disclosure} from '@headlessui/react';

import {Text, IconClose} from '~/components';
import {withPlaceholder} from '~/lib/placeholders';

export function ProductInfo({data = withPlaceholder('PRODUCT_INFO')}) {
  return (
    <section className="grid gap-4 py-4">
      {data.map((section) => (
        <Disclosure
          key={section.title}
          as="div"
          id={section.id}
          className="grid w-full gap-2"
        >
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

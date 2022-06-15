import {Disclosure} from '@headlessui/react';

import {Text} from '~/components';
import {productInfo} from '~/lib/placeholders';

export function ProductInfo({data = productInfo}) {
  return (
    <section className="grid gap-4 py-4">
      {data.map((section) => (
        <Disclosure
          key={section.title}
          as="div"
          id={section.id}
          className="grid w-full gap-2"
        >
          <Disclosure.Button className="text-left">
            <Text size="lead" as="h4">
              {section.title}
            </Text>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4'}>
            <Text>{section.content}</Text>
          </Disclosure.Panel>
        </Disclosure>
      ))}
    </section>
  );
}

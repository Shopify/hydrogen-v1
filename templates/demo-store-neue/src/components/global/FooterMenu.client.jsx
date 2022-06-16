import {Disclosure} from '@headlessui/react';
import {Link} from '@shopify/hydrogen';

import {Heading, IconCaret} from '~/components';

export function FooterMenu({menu}) {
  return (menu?.items || []).map((item) => (
    <section key={item.id} className="grid gap-4">
      <Disclosure>
        {({open}) => (
          <>
            <Disclosure.Button className="text-left md:cursor-default">
              <Heading className="flex justify-between" size="lead" as="h4">
                {item.title}
                <span className="md:hidden">
                  <IconCaret direction={open ? 'up' : 'down'} />
                </span>
              </Heading>
            </Disclosure.Button>
            <div
              className={`${
                open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
              } overflow-hidden transition-all duration-300`}
            >
              <Disclosure.Panel static>
                <nav className="grid gap-2 pb-6">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.to}
                      target={subItem.target}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </nav>
              </Disclosure.Panel>
            </div>
          </>
        )}
      </Disclosure>
    </section>
  ));
}

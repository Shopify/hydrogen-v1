// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Disclosure} from '@headlessui/react';
import {Link, useUrl} from '@shopify/hydrogen';

import {Section, Heading, IconCaret, CountrySelector} from '~/components';
import {footer as mockData} from '~/lib/placeholders';
import type {EnhancedMenu} from '~/lib/utils';

/**
 * A server component that specifies the content of the footer on the website
 */
// @ts-expect-error MockData will be fixed soon
export function Footer({menu = mockData}: {menu?: EnhancedMenu}) {
  const {pathname} = useUrl();
  const isHome = pathname === '/';

  const styles = {
    footer:
      'grid items-start w-full grid-flow-row grid-cols-1 gap-6 py-8 px-6 md:px-8 lg:px-12 border-b md:gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-4 bg-primary dark:bg-contrast dark:text-primary text-contrast',
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={styles.footer}
    >
      {/* TODO: Fix mock data */}
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {/* @ts-expect-error @headlessui/react incompat */}
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
                    <nav className={styles.nav}>
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
      ))}
      <section className={styles.section}>
        <Heading size="lead" className="cursor-default" as="h4">
          Country
        </Heading>
        <CountrySelector />
      </section>
      <div className="pt-8 opacity-50 md:col-span-2 lg:col-span-4">
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project. This website is carbon&nbsp;neutral.
      </div>
    </Section>
  );
}

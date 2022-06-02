import {Link} from '@shopify/hydrogen';
import {CountrySelector} from '~/components/blocks';
import {Heading} from '../elements';
import {footer as mockData} from '~/lib/placeholders';
import Section from './Section';
import {Disclosure} from '@headlessui/react';

/**
 * A server component that specifies the content of the footer on the website
 */

export default function Footer({menus = mockData}) {
  const styles = {
    footer:
      'grid items-start w-full grid-flow-row grid-cols-1 gap-6 py-8 border-b md:gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-4 bg-primary dark:bg-contrast dark:text-primary text-contrast',
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <Section
      as="footer"
      role="contentinfo"
      divider="top"
      className={styles.footer}
    >
      {menus.map((menu) => (
        <section key={menu.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading size="lead" as="h4">
                    {menu.title}
                  </Heading>
                </Disclosure.Button>
                <div className={open ? `block` : `hidden md:block`}>
                  <Disclosure.Panel static>
                    <nav className={styles.nav}>
                      {menu.links.map((link) => (
                        <Link key={link.id} to={link.url}>
                          {link.title}
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
        Licensed Open Source project. This website is carbon neutral.
      </div>
    </Section>
  );
}

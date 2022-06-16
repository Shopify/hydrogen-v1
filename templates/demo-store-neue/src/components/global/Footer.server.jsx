import {useUrl} from '@shopify/hydrogen';

import {Section, Heading, FooterMenu, CountrySelector} from '~/components';

/**
 * A server component that specifies the content of the footer on the website
 */
export function Footer({menu}) {
  const {pathname} = useUrl();
  const isHome = pathname === '/';

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className="
        grid items-start w-full grid-flow-row grid-cols-1 gap-6
        py-8 px-6 md:px-8 lg:px-12 border-b md:gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-4
        bg-primary dark:bg-contrast dark:text-primary text-contrast"
    >
      <FooterMenu menu={menu} />
      <section className="grid gap-4 col-[-1]">
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

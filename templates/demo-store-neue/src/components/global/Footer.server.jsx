import {useUrl} from '@shopify/hydrogen';

import {Section, Heading, FooterMenu, CountrySelector} from '~/components';

/**
 * A server component that specifies the content of the footer on the website
 */
export function Footer({menu}) {
  const {pathname} = useUrl();
  const isHome = pathname === '/';
  const itemsCounts = menu.items.length + 1; // +1 for the country selector

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={[
        'grid items-start grid-flow-row w-full gap-6',
        `py-8 px-6 md:px-8 lg:px-12 border-b md:gap-8 grid-cols-1 lg:gap-12 md:grid-cols-2 lg:grid-cols-${itemsCounts}`,
        'bg-primary dark:bg-contrast dark:text-primary text-contrast',
      ].join(' ')}
    >
      <FooterMenu menu={menu} />
      <section className="grid gap-4 w-full md:max-w-[335px] md:ml-auto">
        <Heading size="lead" className="cursor-default" as="h4">
          Country
        </Heading>
        <CountrySelector />
      </section>
    </Section>
  );
}

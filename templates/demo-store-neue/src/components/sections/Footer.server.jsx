import {Link} from '@shopify/hydrogen';
import {CountrySelector} from '~/components/blocks';
import {Heading} from '../elements';
/**
 * A server component that specifies the content of the footer on the website
 */

const menusPlaceholder = [
  {
    id: 1,
    title: 'Community',
    links: [
      {
        id: 1,
        url: 'https://discord.gg/ppSbThrFaS',
        title: 'Discord',
      },
      {
        id: 2,
        url: 'https://github.com/Shopify/hydrogen',
        title: 'Github',
      },
      {
        id: 3,
        url: 'https://twitter.com/shopifydevs',
        title: 'Twitter',
      },
      {
        id: 4,
        url: '/',
        title: 'Forums',
      },
      {
        id: 5,
        url: '/',
        title: 'Support',
      },
    ],
  },
  {
    id: 2,
    title: 'Learning',
    links: [
      {
        id: 6,
        url: 'https://shopify.dev/custom-storefronts/hydrogen',
        title: 'End-to-end Tutorial',
      },
      {
        id: 7,
        url: 'https://shopify.dev/custom-storefronts/hydrogen',
        title: 'Documentation',
      },
      {
        id: 8,
        url: '/',
        title: 'A Book on Hydrogen',
      },
      {
        id: 9,
        url: 'https://youtube.com',
        title: 'Popular Youtube Series',
      },
      {
        id: 10,
        url: 'https://github.com/Shopify/awesome-hydrogen',
        title: 'Awesome Repo',
      },
    ],
  },
  {
    id: 3,
    title: 'More from Shopify',
    links: [
      {
        id: 1,
        title: 'Content & Metafields',
        url: '/',
      },
      {
        id: 2,
        title: 'Shop Pay',
        url: '/',
      },
      {
        id: 3,
        title: 'Audiences',
        url: '/',
      },
      {
        id: 4,
        title: 'Markets',
        url: '/',
      },
    ],
  },
];

export default function Footer({menus = menusPlaceholder}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2',
  };

  return (
    <footer
      role="contentinfo"
      className="grid items-start w-full grid-cols-4 gap-12 px-12 py-8 border-b bg-primary text-contrast"
    >
      {menus.map((menu) => (
        <section key={menu.id} className={styles.section}>
          <Heading size="lead" as="h4">
            {menu.title}
          </Heading>
          <nav className={styles.nav}>
            {menu.links.map((link) => (
              <Link key={link.id} to={link.url}>
                {link.title}
              </Link>
            ))}
          </nav>
        </section>
      ))}
      <section className={styles.section}>
        <Heading size="lead" as="h4">
          Country
        </Heading>
        <CountrySelector />
      </section>
    </footer>
  );
}

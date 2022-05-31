import {Link} from '@shopify/hydrogen';
import {CountrySelector} from '~/components/blocks';
import {Heading} from '../elements';
import {footer as mockData} from '~/lib/placeholders';
import Section from './Section';
/**
 * A server component that specifies the content of the footer on the website
 */

export default function Footer({menus = mockData}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2',
  };

  return (
    <Section
      as="footer"
      role="contentinfo"
      divider="top"
      className="grid items-start w-full grid-cols-4 gap-12 px-12 py-8 border-b bg-primary dark:bg-contrast dark:text-primary text-contrast"
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
    </Section>
  );
}

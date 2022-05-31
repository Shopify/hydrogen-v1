import {Link, useUrl} from '@shopify/hydrogen';

import {Icon, Input} from '~/components/elements';

/**
 * A client component that specifies the content of the header on the website
 */
export default function Header({title}) {
  const {pathname} = useUrl();

  const dark = pathname === '/';

  const styles = {
    text: `${dark ? 'text-contrast' : 'text-primary'}`,
    button: 'flex items-center justify-center w-8 h-8',
    container: `${
      dark
        ? 'bg-primary/80 text-contrast shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
    } flex items-center sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-xl px-xl py-l`,
  };

  return (
    <header role="banner" className={styles.container}>
      {/* TODO: Have dynamic component for Mobile vs. Desktop headers */}
      <div className="flex gap-xl">
        <Link className={`${styles.text} font-medium`} to="/">
          {title}
        </Link>
        <nav className="flex gap-l">
          {/* TODO: Replace with Navigation API */}
          <Link className={styles.text} to="/collections/freestyle-collection">
            Shop
          </Link>
          <Link className={styles.text} to="/">
            Learn
          </Link>
          <Link className={styles.text} to="/">
            About
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-xs">
        <form className="flex items-center">
          <Input type="search" placeholder="Search" />
          <button type="submit" className={styles.button}>
            <Icon type="search" />
          </button>
        </form>
        <Link className={styles.button} to={'help'}>
          <Icon type="help" />
        </Link>
        <button className={styles.button}>
          <Icon type="account" />
        </button>
        <button className={styles.button}>
          <Icon type="bag" />
        </button>
      </div>
    </header>
  );
}

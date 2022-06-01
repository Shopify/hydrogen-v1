import {Link, useUrl} from '@shopify/hydrogen';

import {
  IconSearch,
  IconHelp,
  IconAccount,
  IconBag,
  Input,
} from '~/components/elements';

/**
 * A client component that specifies the content of the header on the website
 */
export default function Header({title}) {
  const {pathname} = useUrl();

  const dark = pathname === '/';

  const styles = {
    button: 'relative flex items-center justify-center w-8 h-8',
    container: `${
      dark
        ? 'bg-primary/80 dark:bg-contrast/80 text-contrast dark:text-primary shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
    } flex items-center sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-16 px-12 py-8`,
  };

  return (
    <header role="banner" className={styles.container}>
      {/* TODO: Have dynamic component for Mobile vs. Desktop headers */}
      <div className="flex gap-12">
        <Link className={`font-bold`} to="/">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* TODO: Replace with Navigation API */}
          <Link to="/collections">Collections</Link>
          <Link to="/products">Products</Link>
          <Link to="/locations">Locations</Link>
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <form action={'/search'} className="flex items-center gap-2">
          <Input
            className={
              dark
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
          <button type="submit" className={styles.button}>
            <IconSearch />
          </button>
        </form>
        <Link className={styles.button} to={'help'}>
          <IconHelp />
        </Link>
        <button className={styles.button}>
          <IconAccount />
        </button>
        <Link to={'/cart'} className={styles.button}>
          <IconBag />
          <CartBadge dark={dark} quantity={1} />
        </Link>
      </div>
    </header>
  );
}

function CartBadge({dark, quantity}) {
  return (
    <div
      className={`${
        dark
          ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
          : 'text-contrast bg-primary'
      } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
    >
      <span>{quantity}</span>
    </div>
  );
}

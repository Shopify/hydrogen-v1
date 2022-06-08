import {Link, useUrl, useCart} from '@shopify/hydrogen';

import {
  IconSearch,
  IconHelp,
  IconAccount,
  IconBag,
  IconMenu,
  Input,
  Heading,
} from '~/components/elements';

/**
 * A client component that specifies the content of the header on the website
 */
export default function Header({title, menu}) {
  const {pathname} = useUrl();
  const isHome = pathname === '/';

  return (
    <>
      <DesktopHeader isHome={isHome} title={title} menu={menu} />
      <MobileHeader isHome={isHome} title={title} menu={menu} />
    </>
  );
}

function MobileHeader({title, isHome, menu}) {
  const styles = {
    button: 'relative flex items-center justify-center w-8 h-8',
    container: `${
      isHome
        ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
    } flex lg:hidden items-center h-12 md:h-16 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`,
  };

  return (
    <header role="banner" className={styles.container}>
      <div className="flex items-center justify-start w-full gap-4">
        <button className={styles.button}>
          <IconMenu />
        </button>
        <form action={'/search'} className="items-center gap-2 sm:flex">
          <button type="submit" className={styles.button}>
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading className="font-bold text-center" as={isHome ? 'h1' : 'h2'}>
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <button className={styles.button}>
          <IconAccount />
        </button>
        <Link to={'/cart'} className={styles.button}>
          <IconBag />
          <CartBadge dark={isHome} />
        </Link>
      </div>
    </header>
  );
}

function DesktopHeader({title, isHome, menu}) {
  const styles = {
    button: 'relative flex items-center justify-center w-8 h-8',
    container: `${
      isHome
        ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
    } hidden lg:flex items-center sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`,
  };

  return (
    <header role="banner" className={styles.container}>
      {/* TODO: Have dynamic component for Mobile vs. Desktop headers */}
      <div className="flex gap-12">
        <Link className={`font-bold`} to="/">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link key={item.id} to={item.to} target={item.target}>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <form action={'/search'} className="flex items-center gap-2">
          <Input
            className={
              isHome
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
        <Link to={'/account'} className={styles.button}>
          <IconAccount />
        </Link>
        <Link to={'/cart'} className={styles.button}>
          <IconBag />
          <CartBadge dark={isHome} />
        </Link>
      </div>
    </header>
  );
}

function CartBadge({dark}) {
  const {totalQuantity} = useCart();

  return (
    <div
      className={`${
        dark
          ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
          : 'text-contrast bg-primary'
      } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
    >
      <span>{totalQuantity}</span>
    </div>
  );
}

/**
 * Would be helpful to know what this file is intended to do, it's not obvious at a glance
 */
export function HeaderFallback({isHome}: {isHome?: boolean}) {
  const styles = isHome
    ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
    : 'bg-contrast/80 text-primary';
  return (
    <header
      // I feel like this is the first time I'm seeing a role attribute in Hydrogen, do we have good a11y guidelines for this?
      role="banner"
      className={`${styles} flex h-nav items-center backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
    >
      <div className="flex space-x-4">
        <Box isHome={isHome} />
        <Box isHome={isHome} />
        <Box isHome={isHome} />
        <Box isHome={isHome} />
        <Box isHome={isHome} />
      </div>
      <Box isHome={isHome} wide={true} />
    </header>
  );
}

function Box({wide, isHome}: {wide?: boolean; isHome?: boolean}) {
  return (
    <div
      className={`h-6 ${wide ? 'w-32' : 'w-16'} ${
        isHome ? 'bg-gray-600' : 'bg-gray-200'
      }`}
    />
  );
}

import clsx from 'clsx';

import {Heading} from '~/components/elements';

export function PageHeader({
  children,
  className,
  heading,
  variant = 'default',
  ...props
}) {
  const variants = {
    default: 'grid w-full gap-8 p-4 py-8 md:p-8 lg:p-12 justify-items-start',
    allCollections:
      'flex justify-between items-baseline gap-8 p-4 md:p-8 lg:p-12',
    page: 'grid w-full p-4 py-8 md:p-8 lg:p-12 gap-8 grid-cols-1 md:grid-cols-2',
  };

  const styles = clsx(variants[variant], className);

  return (
    <header {...props} className={styles}>
      {heading && (
        <Heading as="h1" size="heading" className="inline-block">
          {heading}
        </Heading>
      )}
      {children}
    </header>
  );
}

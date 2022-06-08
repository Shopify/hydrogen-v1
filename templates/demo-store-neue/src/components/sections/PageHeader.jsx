import clsx from 'clsx';
import {Heading} from '../elements';
export default function PageHeader({
  heading,
  variant = 'default',
  className,
  children,
}) {
  const variants = {
    default: 'grid w-full gap-8 p-4 py-8 md:p-8 lg:p-12 justify-items-start',
    allCollections:
      'flex justify-between items-baseline gap-8 p-4 md:p-8 lg:p-12',
  };
  const styles = clsx(variants[variant], className);
  return (
    <header className={styles}>
      {heading && (
        <Heading as="h1" size="heading" className="inline-block">
          {heading}
        </Heading>
      )}
      {children}
    </header>
  );
}

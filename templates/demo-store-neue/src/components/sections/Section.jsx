import clsx from 'clsx';
import {Heading} from '~/components/elements';

export default function Section({
  heading,
  children,
  className,
  padding = 'all',
}) {
  const paddings = {
    x: 'px-4 md:px-8 lg:px-12',
    y: 'py-4 md:py-8 lg:py-12',
    all: 'p-4 md:p-8 lg:p-12',
  };

  const styles = clsx(
    'w-full grid gap-4 md:gap-8',
    paddings[padding],
    className,
  );

  return (
    <section className={styles}>
      {heading && (
        <Heading size="lead" className={padding === 'y' && paddings['x']}>
          {heading}
        </Heading>
      )}
      {children}
    </section>
  );
}

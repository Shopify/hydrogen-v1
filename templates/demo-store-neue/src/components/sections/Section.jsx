import clsx from 'clsx';
import {Heading} from '~/components/elements';

export default function Section({
  as = 'section',
  heading,
  children,
  className,
  divider,
  padding = 'all',
}) {
  const Component = as;

  const paddings = {
    x: 'px-4 md:px-8 lg:px-12',
    y: 'py-6 md:py-8 lg:py-12',
    swimlane: 'pt-4 md:pt-8 lg:pt-12 md:pb-4 lg:pb-8',
    all: 'p-4 py-6 md:p-8 lg:p-12',
  };

  const dividers = {
    top: 'border-t border-light',
    bottom: 'border-b border-light',
    both: 'border-y border-light',
  };

  const styles = clsx(
    'w-full grid gap-4 md:gap-8',
    paddings[padding],
    dividers[divider],
    className,
  );

  return (
    <Component className={styles}>
      {heading && (
        <Heading size="lead" className={padding === 'y' && paddings['x']}>
          {heading}
        </Heading>
      )}
      {children}
    </Component>
  );
}

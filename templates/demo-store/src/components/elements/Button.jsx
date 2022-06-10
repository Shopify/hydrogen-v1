import {Link} from '@shopify/hydrogen';
import clsx from 'clsx';
import {missingClass} from '~/lib/utils';

export default function Button({
  as = 'button',
  variant = 'primary',
  width = 'auto',
  className = '',
  children,
  ...passthroughProps
}) {
  const Component = passthroughProps.to ? Link : as;

  const variants = {
    primary: 'bg-primary text-contrast',
    secondary: 'border-primary/10 bg-contrast text-primary',
    shop: '',
  };

  const widths = {
    auto: 'w-auto',
    full: 'w-full',
  };

  const styles = clsx(
    'border inline-block rounded font-medium text-center py-3 px-6 max-w-sm leading-none',
    missingClass(className, 'bg-') && variants[variant],
    missingClass(className, 'w-') && widths[width],
    className,
  );

  return (
    <Component className={styles} {...passthroughProps}>
      {children}
    </Component>
  );
}

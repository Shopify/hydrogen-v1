import clsx from 'clsx';
import {Link} from '@shopify/hydrogen';

import {missingClass} from '~/lib/utils';

export function Button({
  as = 'button',
  className = '',
  variant = 'primary',
  width = 'auto',
  ...props
}) {
  const Component = props?.to ? Link : as;

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
    'border inline-block rounded font-medium text-center py-3 px-6 max-w-xl leading-none',
    missingClass(className, 'bg-') && variants[variant],
    missingClass(className, 'w-') && widths[width],
    className,
  );

  return <Component className={styles} {...props} />;
}

Button.displayName = 'Button';

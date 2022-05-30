import clsx from 'clsx';
import {missingClass, formatText} from '~/lib/utils';

export default function Text({
  as = 'span',
  size = 'copy',
  width = 'default',
  className,
  format,
  children,
}) {
  const Component = as;

  const sizes = {
    lead: 'text-lead font-medium',
    copy: 'text-copy',
    fine: 'text-fine',
  };

  const widths = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  };

  const styles = clsx(
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    sizes[size],
    className,
  );

  return (
    <Component className={styles}>
      {format ? formatText(children) : children}
    </Component>
  );
}

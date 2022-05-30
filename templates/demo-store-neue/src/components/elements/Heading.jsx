import clsx from 'clsx';
import {missingClass, formatText} from '~/lib/utils';

export default function Heading({
  as = 'h2',
  size = 'heading',
  width = 'default',
  format = true,
  className = '',
  children,
}) {
  const Component = as;

  const sizes = {
    display: 'font-bold text-display',
    heading: 'font-bold text-heading',
    lead: 'font-bold text-lead',
    copy: 'font-medium text-copy',
  };

  const widths = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  };

  const styles = clsx(
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'max-w-') && widths[width],
    sizes[size],
    className,
  );

  return (
    <Component className={styles}>
      {format ? formatText(children) : children}
    </Component>
  );
}

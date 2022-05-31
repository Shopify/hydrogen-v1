import clsx from 'clsx';
import {missingClass, formatText} from '~/lib/utils';

export default function Heading({
  as = 'h2',
  level,
  size = 'heading',
  width = 'default',
  format = true,
  className = '',
  children,
}) {
  const levels = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  };

  const Component = level ? levels[level] : as;

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

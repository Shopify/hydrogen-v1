import clsx from 'clsx';

export default function Heading({
  as = 'h2',
  size = 'heading',
  className = '',
  children,
}) {
  const Component = as;

  const styles = clsx(
    {
      'font-bold text-display': size === 'display',
      'font-bold text-heading': size === 'heading',
      'font-bold text-lead': size === 'lead',
      'font-medium text-copy': size === 'copy',
      'whitespace-pre-wrap': className.includes('whitespace') === false,
      'max-w-prose': className.includes('max-w') === false,
    },
    className,
  );

  return <Component className={styles}>{children}</Component>;
}

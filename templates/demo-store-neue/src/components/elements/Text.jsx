import clsx from 'clsx';

export default function Text({
  as = 'span',
  size = 'copy',
  className = '',
  children,
}) {
  const Component = as;

  const styles = clsx(
    {
      'text-lead font-medium': size === 'lead',
      'text-copy': size === 'copy',
      'text-fine': size === 'fine',
      'whitespace-pre-wrap': className.includes('whitespace') === false,
      'max-w-prose': className.includes('max-w') === false,
    },
    className,
  );

  return <Component className={styles}>{children}</Component>;
}

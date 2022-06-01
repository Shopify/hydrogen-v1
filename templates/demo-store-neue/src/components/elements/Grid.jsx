import clsx from 'clsx';

export default function Grid({
  as = 'div',
  gap = 'default',
  layout = 'default',
  items = 4,
  flow = 'row',
  children,
  className,
}) {
  const Component = as;

  const layouts = {
    default: `grid-cols-1 sm:grid-cols-2 ${items >= 3 && 'md:grid-cols-3'} ${
      items >= 4 && 'lg:grid-cols-4'
    }`,
    products: `grid-cols-2 ${items >= 3 && 'md:grid-cols-3'} ${
      items >= 4 && 'lg:grid-cols-4'
    }`,
    auto: 'auto-cols-auto',
  };

  const gaps = {
    default: 'grid gap-2 md:gap-4 lg:gap-6',
  };

  const flows = {
    row: 'grid-flow-row',
    col: 'grid-flow-col',
  };

  const styles = clsx(flow[flow], gaps[gap], layouts[layout], className);

  return <Component className={styles}>{children}</Component>;
}

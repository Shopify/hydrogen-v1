const classes = {
  base: '',
  search:
    'bg-transparent text-right border-none focus:border-b focus:border-solid focus:-mb-px focus:border-primary border-0 appearance-none px-4 py-1 focus:ring-transparent placeholder:opacity-20 placeholder:text-inherit',
};

export default function Input({type, className = '', ...props}) {
  return (
    <input
      type={type}
      className={`${classes.base} ${classes[type]} ${className}`}
      {...props}
    />
  );
}

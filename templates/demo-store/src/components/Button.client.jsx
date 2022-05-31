import {Link} from '@shopify/hydrogen';

const DEFAULT_CLASSES =
  'block m-0 w-full items-center justify-center uppercase font-medium text-center px-6 py-4 rounded disabled:border-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed';

const VARIANT_CLASSES = {
  primary: 'text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700',
  secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 border border-black',
};

export const BUTTON_PRIMARY_CLASSES = `${DEFAULT_CLASSES} ${VARIANT_CLASSES.primary}`;
export const BUTTON_SECONDARY_CLASSES = `${DEFAULT_CLASSES} ${VARIANT_CLASSES.secondary}`;

const ExternalIcon = () => (
  <svg
    className="fill-current text-white ml-3"
    width="15"
    height="14"
    viewBox="0 0 15 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.11963 0.000976562C7.56734 0.000976562 7.11963 0.448692 7.11963 1.00098C7.11963 1.55326 7.56734 2.00098 8.11963 2.00098H10.7054L4.41252 8.29387C4.022 8.68439 4.022 9.31756 4.41252 9.70808C4.80305 10.0986 5.43621 10.0986 5.82674 9.70808L12.1196 3.41519V6.00098C12.1196 6.55326 12.5673 7.00098 13.1196 7.00098C13.6719 7.00098 14.1196 6.55326 14.1196 6.00098V1.00098C14.1196 0.448692 13.6719 0.000976562 13.1196 0.000976562H8.11963Z" />
    <path d="M2.11963 2.00098C1.01506 2.00098 0.119629 2.89641 0.119629 4.00098V12.001C0.119629 13.1055 1.01506 14.001 2.11963 14.001H10.1196C11.2242 14.001 12.1196 13.1055 12.1196 12.001V9.00098C12.1196 8.44869 11.6719 8.00098 11.1196 8.00098C10.5673 8.00098 10.1196 8.44869 10.1196 9.00098V12.001H2.11963V4.00098L5.11963 4.00098C5.67191 4.00098 6.11963 3.55326 6.11963 3.00098C6.11963 2.44869 5.67191 2.00098 5.11963 2.00098H2.11963Z" />
  </svg>
);

/**
 * A client component that sets the primary and secondary classes for button components
 */
export default function Button({
  className,
  label,
  handleClick,
  url,
  variant = 'primary',
  passthroughProps,
}) {
  const classes = `${DEFAULT_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;
  const isExternal = url
    ? url.indexOf('://') > 0 || url.indexOf('//') === 0
    : false;

  if (isExternal) {
    return (
      <a href={url} className={classes} {...passthroughProps}>
        {label}
        <ExternalIcon />
      </a>
    );
  }

  if (handleClick) {
    return (
      <button className={classes} onClick={handleClick} type="button">
        {label}
      </button>
    );
  }

  return (
    <Link to={url} className={classes} {...passthroughProps}>
      {label}
    </Link>
  );
}

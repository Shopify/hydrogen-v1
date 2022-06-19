import clsx from 'clsx';

interface IconProps extends React.ComponentProps<typeof Icon> {
  direction?: 'up' | 'right' | 'down' | 'left';
}

function Icon({
  children,
  className,
  fill = 'currentColor',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      {...props}
      fill={fill}
      className={clsx('w-5 h-5', className)}
    >
      {children}
    </svg>
  );
}

export function AccountIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Accounts</title>
      <circle cx="20" cy="10.5" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 19C13.4375 19 9.5 20.2857 9.5 28H30.5C30.5 20.2857 26.5625 19 20 19Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Icon>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Menu</title>
      <line
        x1="3"
        y1="6.375"
        x2="17"
        y2="6.375"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <line
        x1="3"
        y1="10.375"
        x2="17"
        y2="10.375"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <line
        x1="3"
        y1="14.375"
        x2="17"
        y2="14.375"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconArrow({direction = 'right'}: IconProps) {
  let rotate;

  switch (direction) {
    case 'right':
      rotate = 'rotate-0';
      break;
    case 'left':
      rotate = 'rotate-180';
      break;
    case 'up':
      rotate = '-rotate-90';
      break;
    case 'down':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon className={`w-5 h-5 ${rotate}`}>
      <title>Arrow</title>
      <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconCaret({direction = 'down', ...props}: IconProps) {
  let rotate;

  switch (direction) {
    case 'down':
      rotate = 'rotate-0';
      break;
    case 'up':
      rotate = 'rotate-180';
      break;
    case 'left':
      rotate = '-rotate-90';
      break;
    case 'right':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon
      {...props}
      className={`w-5 h-5 transition ${rotate}`}
      fill="transparent"
    >
      <title>Caret</title>
      <path d="M14 8L10 12L6 8" stroke="currentColor" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconSelect(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Select</title>
      <path d="M7 8.5L10 6.5L13 8.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M13 11.5L10 13.5L7 11.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconBag(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Bag</title>
      <path
        fillRule="evenodd"
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
      />
    </Icon>
  );
}

export function IconAccount(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Account</title>
      <path
        fillRule="evenodd"
        d="M9.9998 12.625c-1.9141 0-3.6628.698-5.0435 1.8611C3.895 13.2935 3.25 11.7221 3.25 10c0-3.728 3.022-6.75 6.75-6.75 3.7279 0 6.75 3.022 6.75 6.75 0 1.7222-.645 3.2937-1.7065 4.4863-1.3807-1.1632-3.1295-1.8613-5.0437-1.8613ZM10 18c-2.3556 0-4.4734-1.0181-5.9374-2.6382C2.7806 13.9431 2 12.0627 2 10c0-4.4183 3.5817-8 8-8s8 3.5817 8 8-3.5817 8-8 8Zm0-12.5c-1.567 0-2.75 1.394-2.75 3s1.183 3 2.75 3 2.75-1.394 2.75-3-1.183-3-2.75-3Z"
      />
    </Icon>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Help</title>
      <path d="M3.375 10a6.625 6.625 0 1 1 13.25 0 6.625 6.625 0 0 1-13.25 0ZM10 2.125a7.875 7.875 0 1 0 0 15.75 7.875 7.875 0 0 0 0-15.75Zm.699 10.507H9.236V14h1.463v-1.368ZM7.675 7.576A3.256 3.256 0 0 0 7.5 8.67h1.245c0-.496.105-.89.316-1.182.218-.299.553-.448 1.005-.448a1 1 0 0 1 .327.065c.124.044.24.113.35.208.108.095.2.223.272.383.08.154.12.34.12.558a1.3 1.3 0 0 1-.076.471c-.044.131-.11.252-.197.361-.08.102-.174.197-.283.285-.102.087-.212.182-.328.284a3.157 3.157 0 0 0-.382.383c-.102.124-.19.27-.262.438a2.476 2.476 0 0 0-.164.591 6.333 6.333 0 0 0-.043.81h1.179c0-.263.021-.485.065-.668a1.65 1.65 0 0 1 .207-.47c.088-.139.19-.263.306-.372.117-.11.244-.223.382-.34l.35-.306c.116-.11.218-.23.305-.361.095-.139.168-.3.219-.482.058-.19.087-.412.087-.667 0-.35-.062-.664-.186-.942a1.881 1.881 0 0 0-.513-.689 2.07 2.07 0 0 0-.753-.427A2.721 2.721 0 0 0 10.12 6c-.4 0-.764.066-1.092.197a2.36 2.36 0 0 0-.83.536c-.225.234-.4.515-.523.843Z" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Search</title>
      <path
        fillRule="evenodd"
        d="M13.3 8.52a4.77 4.77 0 1 1-9.55 0 4.77 4.77 0 0 1 9.55 0Zm-.98 4.68a6.02 6.02 0 1 1 .88-.88l4.3 4.3-.89.88-4.3-4.3Z"
      />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props} fill="transparent">
      <title>Check</title>
      <circle
        cx="10"
        cy="10"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.04 10.37 2.42 2.41 3.5-5.56"
      />
    </Icon>
  );
}

export function IconRemove(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Remove</title>
      <path
        transform="translate(4 4)"
        d="M1.0498 0.75C0.917196 0.75 0.790019 0.802679 0.696251 0.896447C0.602483 0.990215 0.549805 1.11739 0.549805 1.25V7.25C0.549805 7.38261 0.602483 7.50979 0.696251 7.60355C0.790019 7.69732 0.917196 7.75 1.0498 7.75C1.18241 7.75 1.30959 7.69732 1.40336 7.60355C1.49713 7.50979 1.5498 7.38261 1.5498 7.25V1.25C1.5498 1.11739 1.49713 0.990215 1.40336 0.896447C1.30959 0.802679 1.18241 0.75 1.0498 0.75ZM3.9498 0.75C3.8172 0.75 3.69002 0.802679 3.59625 0.896447C3.50248 0.990215 3.4498 1.11739 3.4498 1.25V7.25C3.4498 7.38261 3.50248 7.50979 3.59625 7.60355C3.69002 7.69732 3.8172 7.75 3.9498 7.75C4.08241 7.75 4.20959 7.69732 4.30336 7.60355C4.39713 7.50979 4.4498 7.38261 4.4498 7.25V1.25C4.4498 1.11739 4.39713 0.990215 4.30336 0.896447C4.20959 0.802679 4.08241 0.75 3.9498 0.75Z"
      />
      <path d="M12.5 2.5H8.97C8.93489 1.90332 8.72636 1.32986 8.37 0.85C7.94 0.32 7.3 0 6.5 0C5.7 0 5.06 0.32 4.63 0.85C4.27312 1.32958 4.06454 1.9032 4.03 2.5H0.5C0.367392 2.5 0.240215 2.55268 0.146447 2.64645C0.0526784 2.74021 0 2.86739 0 3C0 3.13261 0.0526784 3.25979 0.146447 3.35355C0.240215 3.44732 0.367392 3.5 0.5 3.5H1.75V13.5C1.75 13.78 1.97 14 2.25 14H10.75C10.8826 14 11.0098 13.9473 11.1036 13.8536C11.1973 13.7598 11.25 13.6326 11.25 13.5V3.5H12.5C12.6326 3.5 12.7598 3.44732 12.8536 3.35355C12.9473 3.25979 13 3.13261 13 3C13 2.86739 12.9473 2.74021 12.8536 2.64645C12.7598 2.55268 12.6326 2.5 12.5 2.5ZM5.41 1.48C5.64 1.19 5.99 1 6.5 1C7.01 1 7.35 1.19 7.59 1.48C7.79 1.72 7.89 2.08 7.95 2.5H5.05C5.1 2.08 5.22 1.72 5.41 1.48ZM10.25 13H2.75V3.5H10.25V13Z" />
    </Icon>
  );
}

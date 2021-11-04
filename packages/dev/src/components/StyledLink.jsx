import {Link} from '@shopify/hydrogen/client';

export default function StyledLink({url, value}) {
  return (
    <Link className="text-lg font-bold text-blue-600 font-mono" to={url}>
      <span className="underline">{value}</span>
      <span>{' -->'}</span>
    </Link>
  );
}

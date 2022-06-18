import {Link} from '@shopify/hydrogen';

export default function Index({response}) {
  return (
    <>
      <h1>Data fetching examples</h1>
      <ul>
        <li>
          <Link to="/storefront-api">
            Fetch data from the Storefront API (useShopQuery)
          </Link>
        </li>
        <li>
          <Link to="/third-party-fetch">Third party fetch (fetchSync)</Link>
        </li>
        <li>
          <Link to="/third-party-library">
            Third party library / async operations (useQuery)
          </Link>
        </li>
      </ul>
    </>
  );
}

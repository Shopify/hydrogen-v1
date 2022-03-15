import {Route, useQuery} from '@shopify/hydrogen';

export default function LazyRoute() {
  useQuery(
    'lazyRoute',
    () => new Promise((resolve) => setTimeout(resolve, 100))
  );

  return <Route path="/lazyRoute" page={<Lazy />} />;
}

function Lazy() {
  return <h1>Lazy Route</h1>;
}

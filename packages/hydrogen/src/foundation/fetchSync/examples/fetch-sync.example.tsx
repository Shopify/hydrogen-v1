import {fetchSync} from '@shopify/hydrogen';
import {Suspense} from 'react';
// Use `Suspense` boundaries to define where you want your app to display a loading indicator while your data is being accessed.
export function MyComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}
function MyThings() {
  // To request data from a third-party API, pass the URL to `fetchSync` along with any arguments.
  const things = fetchSync('https://3p.api.com/things.json', {
    method: 'post',
  }).json();
  return <h2>{things.title}</h2>;
}

---
'@shopify/hydrogen': minor
---

Add `scroll` prop to `Link` and `navigate` to allow the scroll restoration behavior to be disabled.

By default, when a `<Link>` component is clicked, Hydrogen emulates default browser behavior and attempts to restore the scroll position previously used in the visitor's session. For new pages, this defaults to scrolling to the top of the page.

However, if you are building a user interface that should fetch a new server components request and update the URL but not modify scroll position, then you can disable scroll restoration using the `scroll` prop:

```jsx
import {Link} from '@shopify/hydrogen';
export default function Index({request}) {
  const url = new URL(request.normalizedUrl);

  return (
    <>
      <p>Current param is: {url.searchParams.get('param')}</p>
      <Link to="/?param=foo" scroll={false}>
        Update param to foo
      </Link>
    </>
  );
}
```

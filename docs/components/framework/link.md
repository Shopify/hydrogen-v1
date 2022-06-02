---
gid: 58ebcc3d-0001-4fb0-9f17-0cc87bb9d40a
title: Link
description: The Link component is used to navigate between routes.
---

The `Link` component is used to navigate between routes. Because it renders an underlying `<a>` element, all properties available to the `<a>` element are also available to the `Link` component. For more information, refer to the [`<a>` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes).

## Example code

{% codeblock file, filename: 'index.server.jsx' %}

```jsx
import {Link} from '@shopify/hydrogen';
export default function Index() {
  return <Link to="/products/hydrogen">Hydrogen</Link>;
}
```

{% endcodeblock %}

## Scroll restoration

By default, when a `<Link>` component is clicked, Hydrogen emulates default browser behavior and attempts to restore the scroll position previously used in the visitor's session. For new pages, this defaults to scrolling to the top of the page.

However, if you are building a user interface that should fetch a new server components request and update the URL but not modify scroll position, then you can disable scroll restoration using the `restoreScroll` prop:


{% codeblock file, filename: 'index.server.jsx' %}

```jsx
import {Link} from '@shopify/hydrogen';
export default function Index({request}) {
  const url = new URL(request.normalizedUrl);

  return (
    <>
      <p>Current param is: {url.searchParams.get('param')}</p>
      <Link to="/?param=foo" restoreScroll={false}>
        Update param to foo
      </Link>
    </>
  );
}
```

{% endcodeblock %}

## Props

| Name            | Type                 | Description                                                                                                                                                                                                                                   |
| --------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to              | <code>string</code>  | The destination URL that the link points to. This is the `href` attribute of the underlying `<a>` element.                                                                                                                                    |
| replace?        | <code>boolean</code> | Whether to update the state object or URL of the current history entry. Refer to the [history.replaceState documentation](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).                                             |
| clientState?    | <code>any</code>     | The custom client state with the navigation.                                                                                                                                                                                                  |
| reloadDocument? | <code>boolean</code> | Whether to reload the whole document on navigation.                                                                                                                                                                                           |
| prefetch?       | <code>boolean</code> | Whether to prefetch the link source when the user signals intent. Defaults to `true`. For more information, refer to [Prefetching a link source](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#prefetching-a-link-source). |
| restoreScroll?  | <code>boolean</code> | Whether to emulate natural browser behavior and restore scroll position on navigation. Defaults to `true`.                                                                                                                                    |

## Component type

The `Link` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related hooks

- [`useNavigate`](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)

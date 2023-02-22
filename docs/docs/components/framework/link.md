# Link


The `Link` component is used to navigate between routes. Because it renders an underlying `<a>` element, all properties available to the `<a>` element are also available to the `Link` component. For more information, refer to the [`<a>` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes).

## Example code

```jsx title="index.server.jsx"
import {Link} from '@shopify/hydrogen';
export default function Index() {
  return <Link to="/products/hydrogen">Hydrogen</Link>;
}
```



## Scroll restoration

By default, when you click a `<Link>` component, Hydrogen emulates default browser behavior and attempts to restore the scroll position that was previously used in the visitor's session. For new pages, the  `<Link>` component defaults to scrolling to the top of the page.

However, if you want to build a user interface that re-renders server components and updates the URL, but doesn't modify the scroll position, then you can disable scroll restoration using the `scroll` prop:

```jsx title="index.server.jsx"
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



## Base path

The `<Link>` component automatically prepends a `basePath` to the destination URL. That `basePath` is inherited from the [`<FileRoutes>` component](/components/framework/fileroutes/) it is rendered within. You can override this default behavior by passing a custom `basePath` prop to the `<Link>` component.

## Props

| Name            | Type                 | Description                                                                                                                                                                                                                                   |
| --------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to              | `string`  | The destination URL that the link points to. This is the `href` attribute of the underlying `<a>` element.                                                                                                                                    |
| replace?        | `boolean` | Whether to update the state object or URL of the current history entry. Refer to the [history.replaceState documentation](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).                                             |
| clientState?    | `any`     | The custom client state with the navigation.                                                                                                                                                                                                  |
| reloadDocument? | `boolean` | Whether to reload the whole document on navigation.                                                                                                                                                                                           |
| prefetch?       | `boolean` | Whether to prefetch the link source when the user signals intent. Defaults to `true`. For more information, refer to [Prefetching a link source](https://shopify.dev/custom-storefronts/hydrogen/routing/manage-routes#prefetch-a-link-source). |
| scroll?         | `boolean` | Whether to emulate natural browser behavior and restore scroll position on navigation. Defaults to `true`.                                                                                                                                    |
| basePath? | `string` | Override the `basePath` inherited from the `<Route>`.

## Component type

The `Link` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related hooks

- [`useNavigate`](/hooks/framework/usenavigate/)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)

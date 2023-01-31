# Link


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

By default, when you click a `<Link>` component, Hydrogen emulates default browser behavior and attempts to restore the scroll position that was previously used in the visitor's session. For new pages, the  `<Link>` component defaults to scrolling to the top of the page.

However, if you want to build a user interface that re-renders server components and updates the URL, but doesn't modify the scroll position, then you can disable scroll restoration using the `scroll` prop:

{% codeblock file, filename: 'index.server.jsx' %}

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

{% endcodeblock %}

## Base path

The `<Link>` component automatically prepends a `basePath` to the destination URL. That `basePath` is inherited from the [`<FileRoutes>` component](/docs/components/framework/fileroutes) it is rendered within. You can override this default behavior by passing a custom `basePath` prop to the `<Link>` component.

## Props

| Name            | Type                 | Description                                                                                                                                                                                                                                   |
| --------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to              | <code>string</code>  | The destination URL that the link points to. This is the `href` attribute of the underlying `<a>` element.                                                                                                                                    |
| replace?        | <code>boolean</code> | Whether to update the state object or URL of the current history entry. Refer to the [history.replaceState documentation](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).                                             |
| clientState?    | <code>any</code>     | The custom client state with the navigation.                                                                                                                                                                                                  |
| reloadDocument? | <code>boolean</code> | Whether to reload the whole document on navigation.                                                                                                                                                                                           |
| prefetch?       | <code>boolean</code> | Whether to prefetch the link source when the user signals intent. Defaults to `true`. For more information, refer to [Prefetching a link source](https://shopify.dev/custom-storefronts/hydrogen/routing/manage-routes#prefetch-a-link-source). |
| scroll?         | <code>boolean</code> | Whether to emulate natural browser behavior and restore scroll position on navigation. Defaults to `true`.                                                                                                                                    |
| basePath? | <code>string</code> | Override the `basePath` inherited from the `<Route>`.

## Component type

The `Link` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related hooks

- [`useNavigate`](/docs/hooks/framework/usenavigate)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)

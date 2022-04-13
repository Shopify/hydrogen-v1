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

## Props

| Name            | Type                 | Description                                                                                                                                                                                                                |
| --------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to              | <code>string</code>  | The destination URL that the link points to. This is the `href` attribute of the underlying `<a>` element.                                                                                                                 |
| replace?        | <code>boolean</code> | Whether to update the state object or URL of the current history entry. Refer to the [history.replaceState documentation](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).                          |
| clientState?    | <code>any</code>     | The custom client state with the navigation.                                                                                                                                                                               |
| reloadDocument? | <code>boolean</code> | Whether to reload the whole document on navigation.                                                                                                                                                                        |
| preload?        | <code>boolean</code> | Whether to prefetch the link source when the user signals intent. Defaults to `true`. For more information, refer to [Prefetching a link source](/custom-storefronts/hydrogen/framework/routes#prefetching-a-link-source). |

## Component type

The `Link` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related hooks

- [`useNavigate`](/api/hydrogen/hooks/framework/usenavigate)

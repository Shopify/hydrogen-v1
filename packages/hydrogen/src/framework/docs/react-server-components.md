<!-- This file is generated from the source code and any changes you make here will be overwritten. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

Hydrogen is modelled after [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html), an approach that offers an opinionated data-fetching and rendering workflow for React apps. React Server Components are rendered in the server-side to improve the performance of React apps by decreasing bundle size and performing queries on the server.

This guide provides information about rules for server and client components and known limitations.

> Note:
> React Server Components are currently in Alpha. However, Hydrogen includes a built-in layer of abstraction that provides stability, regardless of the state of React Server Components.

## Component types

React Server Components include the following component types:

| Type | Description |
|---|---|
| Server | Components that render on the server. Server components don't include any client-side interactivity. Only server components can make calls to the Storefront API. |
| Client | Components that render on the client. These components include client-side interactivity. |
| Shared | Components that render on both the server and the client. |

## Rules for server and client components

React Server Components have the following constraints on server and client components:

- Component filenames ending with `.client.jsx` render on the client.
- Component filenames ending with `.server.jsx` render on the server, and their dependencies aren't in the client bundle.
- Component filenames not ending in `.client.jsx` or `.server.jsx` render on both the server and the client.
- Client components can’t access server-only features, like the filesystem, and can only import other client components.
- Server components can’t access client-only features, like state.

Due to these constraints, there are [specific rules](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#capabilities--constraints-of-server-and-client-components) you need to follow when building your Hydrogen app.

> Tip:
> You don't need to memorize the rules referenced in this section to use React Server Components. Hydrogen has lint rules and error messages to help enforce the constraints on `.server.jsx` and `.client.jsx` files during the rendering process.

![A diagram that illustrates the rules that apply to server and client components](/assets/custom-storefronts/hydrogen/server-client-component-rules.png)

### Example

The following example shows a server component (`Product.server.jsx`) that uses the [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery) hook to fetch data. The data is passed to a client component (`WishListButton.client.jsx`) that uses state:

{% codeblock file, filename: 'Product.server.jsx' %}
```js
import {useShopQuery} from '@shopify/hydrogen';
import WishListButton from './WishListButton.client';

export default function Product() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <section>
      <h1>{data.product.title}</h1>
      <WishListButton product={data.product} />
    </section>
  );
}
```
{% endcodeblock %}


{% codeblock file, filename: 'WishListButton.client.jsx' %}
```js
import {useState} from 'react';

export default function WishListButton({product}) {
  const [added, setAddToWishList] = useState(false);

  return (
    <button onClick={() => setAddToWishList(!added)} type="button">
      {added ? 'Added' : 'Add'} {product.title} to Wish List
    </button>
  );
}
```
{% endcodeblock %}

## Sharing code between server and client

In addition to server-specific and client-specific components, you can also create components, hooks, and utilities that work on both the server and the client. This allows logic to be shared across environments, as long as the components, hooks, and utilities meet all the [constraints of both the server and client components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#sharing-code-between-server-and-client).

![A diagram that illustrates server-specific and client-specific components and hooks, and shared components and hooks between the client and server](/assets/custom-storefronts/hydrogen/hydrogen-shared-components.png)

Although shared components have the most restrictions, many components already obey these rules and can be used across the server and client without modification. For example, many components transform some props based on certain conditions, without using state or loading additional data. This is why shared components are the default and don’t have a special file extension.

## Known limitations

When you send props to client components from a server component, make sure that the props are JSON-serializable. For example, functions or callbacks can't be passed as props.

The following prop would send successfully:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
<MyClientComponent color="red" intro={<p>Here's my favorite color:</p>}>
  Great to have you here today.
</MyClientComponent>
```

{% endcodeblock %}

The following prop wouldn't send successfully:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
<MyClientComponent onClick={() => console.log('uh oh')}>
  Great to have you here today.
</MyClientComponent>
```

{% endcodeblock %}

## Next steps

- Learn how to [work with React Server Components](/api/hydrogen/framework/react-server-components/work-with-rsc).
- Get familiar with the [file-based routing system](/api/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.

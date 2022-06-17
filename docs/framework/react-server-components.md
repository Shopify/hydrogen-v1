---
gid: 30ba6db5-9196-467b-b9c6-886ca42c45ad
title: React Server Components overview
description: Learn about React Server Components, an opinionated data-fetching and rendering workflow for React apps.
---

Hydrogen is modelled after [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html), an approach that offers an opinionated data-fetching and rendering workflow for React apps.

This guide provides information about how React Server Components work in the context of Hydrogen.

> Note:
> Hydrogen's implementation of server components is a stable modified version of React Server Components, which are currently in Alpha. Hydrogen is working with Vercel and the React team to align on enhancements to server components, including [replacing filename suffixes for annotated boundaries](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278) and using async/await for data fetching. Hydrogen will release a future version with these enhancements when they are available, along with tools for migrating existing Hydrogen applications. Learn more about the current state of React Server Components [on the React blog](https://reactjs.org/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022.html#server-components).

## How React Server Components work

React Server Components allow the server and the client to work together to render your Hydrogen app.

For example, the following React element tree is [composed of React components](#composition) that render other React components. React Server Components allow some components to render on the server, some to render in the browser or on the server using server-side rendering (SSR), and others to render on both the server and the client:

![A diagram that illustrates a React element tree composed of server, client, and shared components](/assets/custom-storefronts/hydrogen/react-element-tree.png)

> Note:
> You can't import a server component into a client component. However, you can pass a server component into a client component using [passthrough props](https://shopify.dev/api/hydrogen/components#customizing-hydrogen-components).

### Component types

React Server Components include the following component types:

| Type   | Description                                                                                                                                                                                                                                                                    | Filename convention                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Server | Components that fetch data and render content on the server. Their dependencies aren't in the client bundle. Server components don't include any client-side interactivity. Only server components can make calls to the [Storefront API](https://shopify.dev/api/storefront). | Server components end in `.server.jsx`.                               |
| Client | Components that render on the client. Client components include client-side stateful interactivity.                                                                                                                                                                            | Client components end in `.client.jsx`.                               |
| Shared | Components that render on both the server and the client.                                                                                                                                                                                                                      | Shared components don't end in either `.client.jsx` or `.server.jsx`. |

## Benefits

React Server Components separate client and server logic. This separation provides the following benefits to Hydrogen apps:

- Server-only code that has no impact on bundle size and reduces bundle sizes
- Server-side access to custom and private server-side data sources
- Seamless integration and a well-defined protocol for server and client components
- Streaming rendering and progressive hydration
- Subtree and component-level updates that preserve client state
- [Server and client code sharing](#sharing-code-between-server-and-client), where appropriate

## Constraints

> Tip:
> You don't need to memorize the rules referenced in this section to use React Server Components. Hydrogen has lint rules and error messages to help enforce the constraints on `.server.jsx` and `.client.jsx` files during the rendering process.

React Server Components have the following constraints on server and client components:

- Client components can’t access server-only features, like the filesystem, and can only import other client components.
- Server components can’t access client-only features, like state.

Due to these constraints, there are [specific rules](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#capabilities--constraints-of-server-and-client-components) that you need to follow when building your Hydrogen app:

![A diagram that illustrates the rules that apply to server and client components](/assets/custom-storefronts/hydrogen/server-client-component-rules.png)

### Composition

One of the key constraints of React Server Components is that you can't import and render server components from client components. However, you can compose React Server Components to take in props.

The following example shows how to pass a server component as a `children` prop to a client component. The `OuterServerComponent` can then instantiate both the client and server components. This is how you can have server components under client components in your [React element tree](#how-react-server-components-work).

{% codeblock file, filename: 'MyClientComponent.client.jsx' %}

```js
export default function MyClientComponent({children}) {
  return (
    <div>
      <h1>This code is rendered on the client</h1>
      {children}
    </div>
  );
}
```

{% endcodeblock %}

{% codeblock file, filename: 'MyServerComponent.server.jsx' %}

```js
export default function MyServerComponent() {
  return <span>This code is rendered on the server</span>;
}
```

{% endcodeblock %}

{% codeblock file, filename: 'MyOuterServerComponent.server.jsx' %}

```js
// `MyOuterServerComponent` can instantiate both the client and server
// components. You can pass in `<MyServerComponent/>` as
// the `children` prop to `MyClientComponent`.
import MyClientComponent from './MyClientComponent.client';
import MyServerComponent from './MyServerComponent.server';
export default function MyOuterServerComponent() {
  return (
    <MyClientComponent>
      <MyServerComponent />
    </MyClientComponent>
  );
}
```

{% endcodeblock %}

### Sending props

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

### Sharing code between server and client

In addition to server-specific and client-specific components, you can create components that work on both the server and the client. This allows logic to be shared across environments, as long as the components meet all the [constraints of both the server and client components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#sharing-code-between-server-and-client).

![A diagram that illustrates server-specific and client-specific components, and shared components between the client and server](/assets/custom-storefronts/hydrogen/hydrogen-shared-components.png)

Although shared components have the most constraints, many components already obey these rules and can be used across the server and client without modification. For example, many components transform some props based on certain conditions, without using state or loading additional data. This is why shared components are the default and [don’t have a dedicated file extension](#component-types).

### Component organization and index files

Developers might be familiar with a "facade file" pattern, where similar files are re-exported from a shared `index.js` file in a folder. This pattern is not supported in React Server Components when mixing client components with server components.

Instead, developers wishing to use the facade pattern should create separate files for client and server components:

{% codeblock file, filename: 'components/index.js' %}

```tsx
// ❌ Don't do this, because it mixes client components and server components:

export {Button} from './Button.client.jsx'
export {Dropdown} from './Dropdown.client.jsx'
export {Widget} from './Widget.server.jsx'
```

{% endcodeblock %}

{% codeblock file, filename: 'components/index.js' %}

```tsx
// ✅ Do this, because only client components are exported

export {Button} from './Button.client.jsx'
export {Dropdown} from './Dropdown.client.jsx'
```

{% endcodeblock %}

{% codeblock file, filename: 'components/server.js' %}

```tsx
// ✅ Do this, because only server components are exported

export {Widget} from './Widget.server.jsx'
```

{% endcodeblock %}

## Next steps

- Learn how to [work with React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc).
- Improve your app's loading performance with [streaming SSR and Suspense](https://shopify.dev/custom-storefronts/hydrogen/framework/streaming-ssr).

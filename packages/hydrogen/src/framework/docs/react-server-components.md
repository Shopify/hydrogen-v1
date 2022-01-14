Hydrogen is modelled after [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html), an approach that offers an opinionated data-fetching and rendering workflow for React apps.

This guide provides information about how React Server Components work in the context of Hydrogen.

> Note:
> React Server Components are currently in Alpha. However, Hydrogen includes a built-in layer of abstraction that provides stability, regardless of the state of React Server Components.

## How React Server Components work

React Server Components allow the server and the client to work together to render your Hydrogen app.

For example, the following React element tree is [composed of React components](#composition) that render other React components. React Server Components allow some components to render on the server, some to render on the client, and others to render on both the server and the client:

![A diagram that illustrates a React element tree composed of server, client, and shared components](/assets/custom-storefronts/hydrogen/react-element-tree.png)

### Component types

React Server Components include the following component types:

| Type   | Description | Filename convention                                                                                    
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Server | Components that fetch data and render content on the server. Their dependencies aren't in the client bundle. Server components don't include any client-side interactivity. Only server components can make calls to the [Storefront API](/api/storefront). | End in `.client.jsx` |
| Client | Components that render on the client. These components include client-side stateful interactivity. | End in `.server.jsx` |
| Shared | Components that render on both the server and the client. | Don't end in `.client.jsx` or `.server.jsx` |

## Benefits

React Server Components separate the concerns between client and server logic. This separation provides the following benefits to Hydrogen apps:

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

Due to these constraints, there are [specific rules](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#capabilities--constraints-of-server-and-client-components) you need to follow when building your Hydrogen app:

![A diagram that illustrates the rules that apply to server and client components](/assets/custom-storefronts/hydrogen/server-client-component-rules.png)

### Composition

One of the key constraints of React Server Components is that you can't import and render server components from client components. However, you can compose React Server Components to take in props.

The following example shows how to pass a server component as a `children` prop to a client component. The `OuterServerComponent` can then instantiate both the client and server components. This is how you can have server components under client components in your [React element tree](#how-react-server-components-work).

{% codeblock file, filename: 'MyClientComponent.client.jsx' %}

```js
export default function MyClientComponent({ children }) {
  return (
    <div>
      <h1>This code is rendered on the client</h1>
      {children}
    </div>
  )
}
```

{% endcodeblock %}

{% codeblock file, filename: 'MyServerComponent.server.jsx' %}

```js
export default function MyServerComponent() {
  return <span>This code is rendered on the server</span>
}
```

{% endcodeblock %}

{% codeblock file, filename: 'MyOuterServerComponent.server.jsx' %}

```js
// `MyOuterServerComponent` can instantiate both the client and server
// components. You can pass in a `<MyServerComponent/>` as
// the `children` prop to `MyClientComponent`.
import MyClientComponent from './MyClientComponent.client'
import MyServerComponent from './MyServerComponent.server'
export default function MyOuterServerComponent() {
  return (
    <MyClientComponent>
      <MyServerComponent />
    </MyClientComponent>
  )
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

In addition to server-specific and client-specific components, you can also create components that work on both the server and the client. This allows logic to be shared across environments, as long as the components meet all the [constraints of both the server and client components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#sharing-code-between-server-and-client).

![A diagram that illustrates server-specific and client-specific components, and shared components between the client and server](/assets/custom-storefronts/hydrogen/hydrogen-shared-components.png)

Although shared components have the most restrictions, many components already obey these rules and can be used across the server and client without modification. For example, many components transform some props based on certain conditions, without using state or loading additional data. This is why shared components are the default and don’t have a special file extension.

## Next steps

- Learn how to [work with React Server Components](/custom-storefronts/hydrogen/framework/react-server-components/work-with-rsc).
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.

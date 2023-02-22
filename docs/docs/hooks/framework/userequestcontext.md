# useRequestContext


<aside class="note beta">
<h4>Experimental feature</h4>

<p>Request context is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

The `useRequestContext` hook provides access to a request-scoped context to share data across multiple React Server Components while running on the server. It's useful for writing plugins and third-party libraries.

## Example code

```jsx title="App.server.jsx"
import {useRequestContext} from '@shopify/hydrogen';

const pluginName = 'my-plugin';

function installMyPlugin() {
  const context = useRequestContext(pluginName);
  context.installed = true;
}

function useMyPlugin() {
  return useRequestContext(pluginName);
}

function App() {
  installMyPlugin();

  return /* ... */;
}

function SomeOtherServerComponent() {
  const data = useMyPlugin();
  return <div>{data.installed}</div>
}
```



## Arguments

The `useRequestContext` hook takes the following arguments:

| Key     | Required | Description                                                              |
| ------- | -------- | ------------------------------------------------------------------------ |
| `scope` | No       | A string to encapsulate data so that it's not modified by other scopes.  |

## Return value

The `useRequestContext` hook returns an object that can be mutated to store data.

## Considerations

- Consider using the `useRequestContext` hook only where appropriate. Generally, you should pass props down to the components instead. Use it to cache data across multiple React rendering cycles, or to share data across components that are located in different tree branches.
- The `useRequestContext` hook is only available when running on the server in server components or client components during server-side rendering (SSR). The hook is never shared in the browser.

The `useServerState` hook allows you to [manage server state](/api/hydrogen/framework/server-state) when using Hydrogen as a React Server Component framework.

## Return value

The `useServerState` hook returns an object with the following keys:

| Key              | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `serverState`    | The current server state.                                                              |
| `setServerState` | A function used to modify server state.                                                |
| `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |

## `setServerState`

For convenience, `setServerState` accepts arguments in the following ways:

{% codeblock file %}

```js
// Update a top-level state property based on key
setServerState(key: string, value: any)

// Spread a new value object onto existing state
setServerState(newValue: object)

// Provide a callback function to update the state completely
setServerState((previousState) => object)
```

{% endcodeblock %}

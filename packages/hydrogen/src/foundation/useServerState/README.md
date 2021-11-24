<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useServerState and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useServerState` hook allows you to [manage server state](/custom-storefronts/hydrogen/framework/server-state) when using Hydrogen as a React Server Component framework.

## Return value

The `useServerState` hook returns an object with the following keys:

| Key              | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `serverState`    | The current server state.                                                              |
| `setServerState` | A function used to modify server state.                                                |
| `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |

## Example code

```tsx
// For convenience, `setServerState` accepts arguments in the following ways:

// Update a top-level state property based on key
setServerState(key, value);

// Spread a new value object onto existing state
setServerState(newValue);

// Provide a callback function to update the state completely
setServerState((previousState) => object);
```

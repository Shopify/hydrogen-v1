# useServerProps


The `useServerProps` hook allows you to manage the [server props](https://shopify.dev/custom-storefronts/hydrogen/server-props) passed to your server components when using Hydrogen as a React Server Component framework. The server props get cleared when you navigate from one route to another.

## Example code

```tsx
// `setServerProps` accepts arguments in the following ways:

// Update a top-level server component prop based on key
setServerProps(key, value);

// Spread a new value object onto existing props
setServerProps(newValue);

// Provide a callback function to update the state completely
setServerProps((previousProps) => object);
```

## Return value

The `useServerProps` hook returns an object with the following keys:

| Key              | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `serverProps`    | The current server props.                                                              |
| `setServerProps` | A function used to modify server props.                                                |
| `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |

## Related framework topics

- [Server props](https://shopify.dev/custom-storefronts/hydrogen/server-props)
- [Working with React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components/work-with-rsc)

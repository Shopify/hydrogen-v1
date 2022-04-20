<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useServerProps and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useServerProps` hook allows you to manage the [server props](https://shopify.dev/custom-storefronts/hydrogen/framework/server-props) passed to your server components when using Hydrogen as a React Server Component framework. The server props get cleared when you navigate from one route to another.

## Return value

The `useServerProps` hook returns an object with the following keys:

| Key              | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `serverProps`    | The current server props.                                                              |
| `setServerProps` | A function used to modify server props.                                                |
| `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |

## Example code

```tsx
// For convenience, `setServerProps` accepts arguments in the following ways:

// Update a top-level server component prop based on key
setServerProps(key, value);

// Spread a new value object onto existing props
setServerProps(newValue);

// Provide a callback function to update the state completely
setServerProps((previousProps) => object);
```

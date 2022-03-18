<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useLoadScript and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useLoadScript` hook loads an external script tag on the client-side.

## Example code

```tsx
import {useLoadScript} from '@shopify/hydrogen';

export function MyComponent() {
  const scriptStatus = useLoadScript(
    'https://cdn.shopify.com/shopifycloud/shop-js/v0.1/client.js'
  );

  if (scriptStatus === 'loading') {
    return <div>loading...</div>;
  }

  if (scriptStatus === 'error') {
    return <div>error...</div>;
  }

  // shop-pay-button custom element is available to use
  return <shop-pay-button />;
}
```

## Arguments

The `useLoadScript` hook takes the following arguments:

| Parameter | Required | Description                                                                                                         |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `url`     | Yes      | The URL string for the external script.                                                                             |
| `options` | No       | An object that gets passed to the underlying `<script>` tag. Currently only supports `{module: true}` as an option. |

## Return value

The `useLoadScript` hook returns the following values that allow you to understand the state of the external script you are loading:

| Value     | Description                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading` | The script is still loading. For example, the script tag can be on the page but the resource might not be fully loaded yet while in this state. |
| `done`    | The script is fully loaded and ready to use.                                                                                                    |
| `error`   | There was an error loading the script.                                                                                                          |

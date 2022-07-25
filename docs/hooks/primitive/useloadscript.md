---
gid: d8cc3aa8-cdc9-4f9e-8148-7f8ec47aad44
title: useLoadScript
description: The useLoadScript hook loads an external script tag on the client-side.
---

The `useLoadScript` hook loads an external script tag on the client-side.

> Note:
> Call `loadScript` from regular JavaScript functions and React hooks instead of calling `useLoadScript`.

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
| `options` | No       | An object that gets passed to the underlying `<script>` tag. Currently only supports `{module?: true, in?: 'body' | 'head'}` as options. |

## Return value

The `useLoadScript` hook returns the following values that allow you to understand the state of the external script you are loading:

| Value     | Description                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading` | The script is still loading. For example, the script tag can be on the page but the resource might not be fully loaded yet while in this state. |
| `done`    | The script is fully loaded and ready to use.                                                                                                    |
| `error`   | There was an error loading the script.                                                                                                          |

---
gid: 4e10ec36-3dbb-11ed-b878-0242ac120002
title: useScript
description: The useScript hook loads an external script element on the client-side.
---

<aside class="note beta">
<h4>Experimental feature</h4>

<p>Hydrogen useScript is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

The `useScript` hook loads an external script element on the client-side.

## Example code

{% codeblock file, filename: 'MyComponent.client.jsx' %}
```tsx
import {useScript} from '@shopify/hydrogen/experimental';

export function MyClientComponent() {
  const status = useScript({
    id = 'shop-pay-web-component',
    src = 'https://cdn.shopify.com/shopifycloud/shop-js/v0.1/client.js',
  });

  if (status === 'loading') {
    return <div>loading...</div>;
  }

  if (status === 'error') {
    return <div>error...</div>;
  }

  // "done" — shop-pay-button custom element is available to use
  return <shop-pay-button />;
}
```
{% endcodeblock %}


## Arguments

The `useScript` hook takes the following arguments:

| Parameter | Required | Description                                                                                                         |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `id`     | Yes      | A unique identifier for the script tag                                                                             |
| `url`     | Yes      | The URL string for the external script.                                                                             |
| `target`           | <code>"head" \| "body" (default)</code>      | The target DOM element where the script should be inserted. This feature is only available to non-inline loading strategies such as
| `load`          | <code>"afterHydration" (default) \| "onIdle"</code>| The loading strategy. See loading strategies [`section`](https://shopify.dev/api/hydrogen/components/primitive/script#loading-strategies) for more info. |
| `reload`         | <code>boolean (default false)</code> | Scripts rendered with this option will be reloaded after every page navigation (if available on the next route). This option is only available in "afterHydration" and "onIdle" loading strategies. |

## Return value

The `useLoadScript` hook returns the following values that allow you to understand the state of the external script you are loading:

| Value     | Description                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading` | The script is still loading. For example, the script tag can be on the page but the resource might not be fully loaded yet while in this state. |
| `done`    | The script is fully loaded and ready to use.                                                                                                    |
| `error`   | There was an error loading the script.                                                                                                          |


## Advanced example code (reload)

{% codeblock file, filename: 'ProductDetails.client.jsx' %}
```tsx
import {useScript} from '@shopify/hydrogen/experimental';

export function ProductDetails() {
  const selectedVariant = ...
  const status = useScript({
    id = 'reviews-widget',
    load = 'onIdle',
    reload = true,
    src = '//reviews-app.com/widget.js',
  });

  if (status === 'loading') {
    return <div>loading...</div>;
  }

  if (status === 'error') {
    return <div>error...</div>;
  }

  // reviews web element is available to use
  return <reviews-stars variant-id={selectedVariant} />;
}
```
{% endcodeblock %}

## Related components

- [`Script`](https://shopify.dev/api/hydrogen/components/primitive/script)

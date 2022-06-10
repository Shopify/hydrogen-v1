---
'@shopify/hydrogen': minor
---

Metafields have changed in Storefront API `2022-07`. We updated our code to work with that update, which means that the following changes will **only work if you're using `2022-07` or newer.**

## Metafields changes

### Storefront API `2022-07`

Metafields have changed how you access them in the Storefront API. See [the release notes](https://shopify.dev/api/release-notes/2022-07) for more details. In order to support the new way of querying metafields, Hydrogen has made the following updates:

### `<Metafield/>`

Previously, the `<Metafield/>` component expected you to use `useParseMetafields()` before passing a metafield to it.

Now, `<Metafield/>` will use `parseMetafield()` itself so that you don't have to. However, this does mean that if you use `parseMetafield()` and then pass it to `<Metafield/>`, it will likely break because it will try to parse your metafield's value a second time.

### `useParsedMetafields()` and `parseMetafield()`

Deprecated `useParsedMetafields()` in favor of `parseMetafield()`. `parseMetafield()` takes in a single metafield and returns a new object, and importantly it can be used on both the client _and_ the server.

If you need to memoize the value on the client, then you can do so using `React.memo`:

```tsx
import {useMemo} from 'react';
import {parseMetafield} from '@shopify/hydrogen'x

function MyComponent() {
  const parsedMetafield = useMemo(() => parseMetafield(metafield), [metafield]);
}
```

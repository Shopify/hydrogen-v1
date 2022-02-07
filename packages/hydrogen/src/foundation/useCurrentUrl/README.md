<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useCurrentUrl and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

Use to get current url in server or client component.

## Example code

```tsx
import {useCurrentUrl} from '@shopify/hydrogen';

export default function Page() {
  const url = useCurrentUrl();

  return <h1>Current Url is: {url.href}</h1>;
}
```

## Return value

The `useCurrentUrl` hook returns an [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object with the current url

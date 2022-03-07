---
'template-hydrogen-default': minor
'@shopify/hydrogen': minor
---

Update RawHtml and its docs to remove the unsanitize option.

Follow these instructions to upgrade your project:

1. For anywhere you use `RawHtml` component, update `string` to `dangerouslySetInnerHTMLString`

```jsx
import {RawHtml} from '@shopify/hydrogen';

export function MyComponent() {
  return <RawHtml dangerouslySetInnerHTMLString="<p>Hello world</p>" />;
}
```

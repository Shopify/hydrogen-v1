# Prefer using the `Script` component instead of HTML `script` tags

Scripts loaded at the wrong time can negatively [Core Web Vital](https://web.dev/vitals/) that [Google uses in search ranking](https://developers.google.com/search/blog/2020/05/evaluating-page-experience) performance.

## Rule details

This rule prevents using the `script` tag directly and suggests using the [`Script`](https://shopify.dev/api/hydrogen/components/primitive/script) component from `@shopify/hydrogen`.

### Incorrect code

```tsx
function MyComponent() {
  return <script async src="https://www.googletagmanager.com/gtm.js" />;
}
```

### Correct code

```tsx
import {Script} from '@shopify/hydrogen';

function MyComponent() {
  return (
    <Script
      id="gtm"
      load="inWorker"
      src="https://www.googletagmanager.com/gtm.js"
    />
  );
}
```

# Prefer using the `Image` component instead of HTML `img` tags

Images can cause layout shifts if they load after the surrounding page has already rendered. This can lead to [Cumulative Layout Shift](https://web.dev/cls/), a [Core Web Vital](https://web.dev/vitals/) that [Google uses in search ranking](https://developers.google.com/search/blog/2020/05/evaluating-page-experience).

## Rule details

This rule prevents using the `img` tag directly and suggests using the [`Image`](https://shopify.dev/api/hydrogen/components/primitive/image) component from `@shopify/hydrogen`.

### Incorrect code

```tsx
// Component.client.jsx
function MyComponent() {
  return (
    <img src="/image.png" alt="My product image" width={300} height={300} />
  );
}
```

### Correct code

```tsx
// Component.client.jsx
import {Image} from '@shopify/hydrogen';

function MyComponent() {
  return (
    <Image src="/image.png" alt="My product image" width={300} height={300} />
  );
}
```

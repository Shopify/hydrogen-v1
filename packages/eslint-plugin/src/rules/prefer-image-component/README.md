# Prefer using @shopify/hydrogen `Image` component in place of HTML `img` tags(`hydrogen/prefer-image-component`)

Images can cause layout shifts if they load after the surrounding page has already rendered. This can lead to [Cumulative Layout Shift](https://web.dev/cls/), a [Core Web Vital](https://web.dev/vitals/) that [Google uses in search ranking](https://developers.google.com/search/blog/2020/05/evaluating-page-experience).

## Rule Details

This rule prevents using the `img` tag directly and suggests using the `Image` component from `@shopify/hydrogen`.

Examples of **incorrect** code for this rule:

```tsx
function MyComponent() {
  return (
    <img src="/image.png" alt="My product image" width={300} height={300} />
  );
}
```

Examples of **correct** code for this rule:

```tsx
import {Image} from '@shopify/hydrogen';

function MyComponent() {
  return (
    <Image src="/image.png" alt="My product image" width={300} height={300} />
  );
}
```

---
'@shopify/hydrogen': minor
---

Support for CSS Modules has been improved. It now behaves closer to the default behavior in Vite where styles are collected automatically.

Remove the `StyleTag` component that was needed before:

```diff
export default function MyComponent() {
  return (
    <div>
-      <myStyles.StyleTag />
      <h1>Title</h1>
    </div>
  );
}
```

Optionally, update your wildcard imports to default or named imports:

```diff
-import * as myStyles from './my.module.css';
+import myStyles from './my.module.css';
// Or
+import {red, gren, blue} from './my.module.css';
```

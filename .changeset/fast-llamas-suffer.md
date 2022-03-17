---
'@shopify/hydrogen': minor
---

Adds [CSS Modules](https://github.com/css-modules/css-modules) support. Hydrogen now includes a [Vite plugin](https://vitejs.dev/guide/features.html#css-modules) that collects styles for each CSS Module and exports them to a `StyleTag` component. To use CSS Modules in your Hydrogen app, you must render the style tag in the component along with your styles:

```js
import * as styles from './styles.module.css';

export default MyComponent() {
  return (
    <div className={styles.wrapper}>
      // A style is rendered inline
      <styles.StyleTag />
      <p>Hello</p>
    </div>
  );
}
```

Explore an [example implementation of CSS Modules in GitHub](https://github.com/Shopify/hydrogen/tree/main/examples/css-modules).

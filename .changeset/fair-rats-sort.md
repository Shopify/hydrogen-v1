---
'@shopify/hydrogen': minor
---

With the introduction of authenticated pages, we also now provide the ability to prevent pages from being indexed by bots. You can do so by passing `noindex` to the `Seo` component:

```jsx
<Seo type="noindex" data={{title: 'Login'}} />
```

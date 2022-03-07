---
'template-hydrogen-default': minor
'@shopify/hydrogen': minor
---

Remove `RawHtml` and its docs mentions.

Follow these instructions to upgrade your project:

1. For anywhere you use `RawHtml` component, update to follow
   [React's `dangerouslySetInnerHTML`](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

```jsx
-(<RawHtml string="<p>Hello world</p>" />);
+(<div dangerouslySetInnerHTML={{__html: '<p>Hello world</p>'}} />);
```

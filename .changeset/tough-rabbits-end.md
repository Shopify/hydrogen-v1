---
'template-hydrogen-default': minor
'@shopify/hydrogen': minor
---

Removed the `Rawhtml` component.

Upgrade your project by replacing references to the `RawHtml` component to follow
   [React's `dangerouslySetInnerHTML`](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml):

```jsx
-(<RawHtml string="<p>Hello world</p>" />);
+(<div dangerouslySetInnerHTML={{__html: '<p>Hello world</p>'}} />);
```

---
'@shopify/hydrogen': patch
---

Client-side apps now have React's `StrictMode` component wrapping the whole app, with an option to disable it. If you do turn it off, it is recommended that you still include the `StrictMode` component at as high of a level as possible in your React tree.

See also [React 17's docs](https://reactjs.org/docs/strict-mode.html) on `StrictMode`, and [React 18's updates](https://github.com/reactwg/react-18/discussions/19) to `StrictMode`.

---
'@shopify/hydrogen': patch
---

When a route is rendering, if Hydrogen has already started streaming, it is invalid to call `response.doNotStream()`. Disabling streaming should always happen before any async operation in your route server component. This change fixes Hydrogen to warn if you try to disable streaming after the stream has already begun.

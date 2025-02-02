---
'@shopify/hydrogen': patch
---

Fix a critical issue where a top level asynchronous request within `App.server.jsx` would break if subsequent routes attempt to disable streaming.

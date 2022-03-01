---
'@shopify/hydrogen': patch
---

Fix internal url usage in platforms like Vercel, which already provides protocol and host in `request.url`.

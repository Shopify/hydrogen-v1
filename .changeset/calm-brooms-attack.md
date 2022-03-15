---
'@shopify/hydrogen': patch
---

Remove useQuery hook from client exports to avoid leaking server logic to the browser.

---
'@shopify/hydrogen': patch
---

Fix a problem where encoded html content props passed from server to client components would get double decoded, and break hydration on app load.

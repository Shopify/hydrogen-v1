---
'@shopify/hydrogen': patch
---

Fix HMR in client components. It should now update only the modified client component in the browser instead of refreshing the entire page.

---
'@shopify/hydrogen': patch
---

Buffer RSC flight responses. There isn't any benefit to streaming them, because we start a transition on page navigation. Buffering also fixes caching problems on the flight response.

---
'@shopify/hydrogen': patch
---

Custom loggers can return promises from their methods. Hydrogen will await for them after the current request is over but before the runtime instance ends.

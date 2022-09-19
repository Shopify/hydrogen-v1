---
'@shopify/hydrogen': patch
---

We changed the default logging behavior to include the overal request outcome, either `ok` or an `error`. This is necessary because a streamed request might start with a 200 HTTP response code, and during the process of stream rendering an error is encountered.

---
'@shopify/hydrogen': patch
---

Fix preloading queries in workers to prevent waterfall requests. 

**Breaking change**: `fetchBuilder` no longer accepts a `Request` argument. Instead, it now accepts a `url: string` and `options: FetchInit`:

```diff
-fetchBuilder(new Request('https://my.endpoint.com', {headers: {foo: 'bar'}}));
+fetchBuilder('https://my.endpoint.com', {headers: {foo: 'bar}});
``

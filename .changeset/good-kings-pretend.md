---
'@shopify/hydrogen': patch
---

Improvements and fixes to hydrogen logging:

1. API Routes are now passed a reference to the logger bound to the current request:

```ts
export async function api(request, {log}) {
  log.warn("Here's a warning!");
  return new Request('Hello World');
}
```

2. If you define a custom logging implementation within your Hydrogen config, we'll now warn you when your logging implementation itself errors.

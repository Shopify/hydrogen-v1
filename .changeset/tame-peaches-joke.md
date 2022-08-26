---
'@shopify/hydrogen': patch
---

Improve error handling:

1. Improve how errors are default presented in the logs.
1. Make sure that when useShopQuery fails, that an Error object is propagated.

If you have implemented your own logging handler, it is recommended that you only print strings, as printing objects (including Error objects) will result in unhelpful logs in many runtimes (Oxygen included):

```js
// Example custom logging for errors
export default defineConfig({
  logger: {
    error: (context, error) => {
      const url = context ? ` ${context.url}` : '';

      if (error instanceof Error) {
        // Do NOT directly just print the error, instead
        // print the error.messag or error.stack
        console.error(`Error:${url}\n${error.stack}`);
      } else {
        console.error(`Error:${url} ${error}`);
      }
    },
  },
});
```

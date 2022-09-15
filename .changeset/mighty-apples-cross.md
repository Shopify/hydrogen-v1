---
'create-hydrogen-app': patch
---

If the demo store e2e tests are sometimes failing, update your `vite.config.js` to make sure that tests only execute on one thread:

```diff
export default defineConfig({
  plugins: [hydrogen()],
  resolve: {
    alias: [{find: /^~\/(.*)/, replacement: '/src/$1'}],
  },
  optimizeDeps: {
    include: ['@headlessui/react', 'clsx', 'react-use', 'typographic-base'],
  },
  test: {
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
+    maxThreads: 1,
+    minThreads: 1,
  },
});
```

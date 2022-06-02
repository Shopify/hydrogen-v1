---
'@shopify/hydrogen': minor
---

The client configuration, including the `strictMode` option, has been moved from custom client entry handlers to the Hydrogen configuration file. If you had a custom client entry file just to pass client options, you can remove it and do the same in `hydrogen.config.js`:

```diff
// Custom client entry handler

-renderHydrogen(ClientWrapper, {strictMode: false});
+renderHydrogen(ClientWrapper);
```

```diff
// hydrogen.config.jsx

export default defineConfig({
+  strictMode: false,
});
```

To remove a custom client entry handler in case it's not needed anymore, delete the custom file and change `index.html`:

```diff
<body>
  <div id="root"></div>
- <script type="module" src="/src/custom-client-entry"></script>
+ <script type="module" src="/@shopify/hydrogen/entry-client"></script>
</body>
```

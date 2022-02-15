## Considerations

- `ShopifyProvider` is specific to Hydrogen and currently doesn't work in Next.js or other frameworks.
- You can't have multiple instances of `ShopifyProvider` within your app. Because it's not using `Context` (which isn't currently supported in server components), all `<ShopifyProvider>` instances share the same configuration for each request.
- You can dynamically define the configuration (`shopifyConfig` prop) for each request to the server. This is useful for aggregating multiple storefronts with a single Hydrogen app.

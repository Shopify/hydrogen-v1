## Considerations

- You can't have multiple instances of `ShopifyProvider` within your app. Because it's not using `Context` (which isn't currently supported in server components), all `<ShopifyProvider>` instances share the same configuration per request.
- You can dynamically define the `shopifyConfig` prop, and it will remain isolated per request to the server. This is useful for aggregating multiple storefronts with a single Hydrogen app.

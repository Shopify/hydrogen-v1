---
'@shopify/hydrogen': patch
---

We've decided to deprecate the `<LocalizationProvider>`, and instead put all its functionality into `<ShopifyProvider>`. The justification is that both providers are required by many components and hooks, and we think it's easier to have a single required `<ShopifyProvider>` instead of two. The same props available to the `<LocalizationProvider>` are now available on the `<ShopifyProvider>`.

```diff
// App.server.tsx
function App({routes, request}: HydrogenRouteProps) {
  ...
  return (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
+     <ShopifyProvider countryCode={countryCode as CountryCode}>
-     <ShopifyProvider>
-     <LocalizationProvider countryCode={countryCode as CountryCode}>
        <CartProvider countryCode={countryCode as CountryCode}>
            ...
        </CartProvider>
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
        <ShopifyAnalytics />
-     </LocalizationProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
```

Note: this is not a breaking change. `<LocalizationProvider>` will still be available, but all documentation will now point to `<ShopifyProvider>`.

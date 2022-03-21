import {Router, FileRoutes, Route} from '@shopify/hydrogen';
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <CartProvider>
          <Router>
            <FileRoutes basePath="/es/" routes={esRoutes} />
            <FileRoutes basePath="/en/" routes={enRoutes} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
function NotFound() {
  return <h1>Not found</h1>;
}

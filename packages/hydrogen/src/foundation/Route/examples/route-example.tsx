import {Router, Route} from '@shopify/hydrogen';
function App({routes}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <CartProvider>
          <Router>
            <Route path="/" page={<Home />} />
            <Route path="/products/:handle" page={<Product />} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
function Products({params}) {
  return <h1>Product name: {params.handle}</h1>;
}
function Home() {
  return <h1>Home</h1>;
}
function NotFound() {
  return <h1>Not found</h1>;
}

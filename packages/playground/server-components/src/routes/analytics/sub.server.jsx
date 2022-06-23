import {
  Link,
  PerformanceMetrics,
  ShopifyAnalytics,
  useServerAnalytics,
} from '@shopify/hydrogen';

export default function SubPage() {
  useServerAnalytics({
    shopify: {
      pageType: 'page',
    },
  });

  return (
    <>
      <h1>Sub page</h1>

      <Link className="btn" to="/analytics/full">
        Full page
      </Link>

      <PerformanceMetrics />
      <ShopifyAnalytics />
    </>
  );
}

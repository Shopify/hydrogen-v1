import {
  Link,
  PerformanceMetrics,
  ShopifyAnalytics,
  useServerAnalytics,
} from '@shopify/hydrogen';

export default function FullPage() {
  useServerAnalytics({
    shopify: {
      pageType: 'index',
    },
  });

  return (
    <>
      <h1>Full page</h1>

      <Link className="btn" to="/analytics/sub">
        Sub page
      </Link>
      <PerformanceMetrics />
      <ShopifyAnalytics />
    </>
  );
}

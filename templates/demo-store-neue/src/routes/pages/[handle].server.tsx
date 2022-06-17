import {
  useShop,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
  HydrogenRouteProps,
} from '@shopify/hydrogen';

import {Layout, NotFound, PageHeader} from '~/components';

export default function Page({params}: HydrogenRouteProps) {
  const {languageCode} = useShop();

  const {handle} = params;
  const {
    data: {page},
  } = useShopQuery({
    query: PAGE_QUERY,
    variables: {languageCode, handle},
  });

  if (!page) {
    return <NotFound />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
      resourceId: page.id,
    },
  });

  return (
    <Layout>
      <Seo type="page" data={page} />
      <PageHeader heading={page.title} variant="page">
        <div
          dangerouslySetInnerHTML={{__html: page.body}}
          className="prose dark:prose-invert"
        />
      </PageHeader>
    </Layout>
  );
}

const PAGE_QUERY = gql`
  query PageDetails($languageCode: LanguageCode, $handle: String!)
  @inContext(language: $languageCode) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

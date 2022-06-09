import {
  useShop,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {NotFound} from '~/components/pages';

export default function Page({params}) {
  const {languageCode} = useShop();

  const {handle} = params;
  const {data} = useShopQuery({
    query: PAGE_QUERY,
    variables: {languageCode, handle},
  });

  useServerAnalytics(
    data.pageByHandle
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.page,
            resourceId: data.pageByHandle.id,
          },
        }
      : null,
  );

  if (!data.pageByHandle) {
    return <NotFound />;
  }

  const page = data.pageByHandle;

  return (
    <Layout>
      <Seo type="page" data={page} />
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <div dangerouslySetInnerHTML={{__html: page.body}} className="prose" />
    </Layout>
  );
}

Page.displayName = 'Page';

const PAGE_QUERY = gql`
  query PageDetails($languageCode: LanguageCode, $handle: String!)
  @inContext(language: $languageCode) {
    pageByHandle(handle: $handle) {
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

import {
  useShop,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';

import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';

export default function Page({params}) {
  const {languageCode} = useShop();

  const {handle} = params;
  const {data} = useShopQuery({
    query: QUERY,
    variables: {language: languageCode, handle},
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
      <div
        dangerouslySetInnerHTML={{__html: page.body}}
        className="prose mt-8"
      />
    </Layout>
  );
}

const QUERY = gql`
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    pageByHandle(handle: $handle) {
      id
      title
      body
      title
      seo {
        description
        title
      }
    }
  }
`;

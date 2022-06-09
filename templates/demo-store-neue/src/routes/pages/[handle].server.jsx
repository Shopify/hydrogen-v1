import {
  useShop,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';
import {NotFound} from '~/components/pages';

export default function Page({params}) {
  const {languageCode} = useShop();

  const {handle} = params;
  const {data} = useShopQuery({
    query: QUERY,
    variables: {language: languageCode, handle},
  });

  useServerAnalytics(
    data.page
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.page,
            resourceId: data.page.id,
          },
        }
      : null,
  );

  if (!data.page) {
    return <NotFound />;
  }

  const page = data.page;

  return (
    <Layout>
      <Seo type="page" data={page} />
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <div dangerouslySetInnerHTML={{__html: page.body}} className="prose" />
    </Layout>
  );
}

const QUERY = gql`
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
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

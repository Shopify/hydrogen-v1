import {useShop, useShopQuery, Seo, gql, Image} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';

export default function Page({params}) {
  const {languageCode} = useShop();

  const {handle} = params;
  const {data} = useShopQuery({
    query: QUERY,
    variables: {language: languageCode, handle},
  });

  const article = data.blog.articleByHandle;

  return (
    <Layout>
      <Seo type="page" data={data.blog.articleByHandle} />
      <section className="w-2/4 m-auto gap-4 md:gap-8 p-4 py-6 md:p-8 lg:p-12">
        <h1 className="text-4xl font-bold w-4/5 m-auto">{article.title}</h1>
        <span className="block m-auto w-4/5 mt-6 text-base">
          June 22, 2022 · Michelle Vinci
        </span>
        <Image data={data.blog.articleByHandle.image} className="mt-16" />
        <div
          dangerouslySetInnerHTML={{__html: article.contentHtml}}
          className="prose w-4/5 m-auto mt-16 max-w-max mb-24"
        />
      </section>
    </Layout>
  );
}

const QUERY = gql`
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    blog(handle: "journal") {
      articleByHandle(handle: $handle) {
        title
        contentHtml
        image {
          id
          altText
          url
          width
          height
        }
      }
    }
  }
`;

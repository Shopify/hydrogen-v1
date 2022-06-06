import {
  useShop,
  useShopQuery,
  Seo,
  gql,
  Image,
  CacheDays,
} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';
const dateFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export default function Page({params, response}) {
  response.cache(CacheDays());
  const {languageCode, locale} = useShop();

  const {handle} = params;
  const {data} = useShopQuery({
    query: QUERY,
    variables: {language: languageCode, handle},
  });

  const {title, publishedAt, contentHtml, author} = data.blog.articleByHandle;
  const formattedDate = new Intl.DateTimeFormat(
    locale,
    dateFormatOptions,
  ).format(new Date(publishedAt));
  return (
    <Layout>
      <Seo type="page" data={data.blog.articleByHandle} />
      <section className="w-2/4 m-auto gap-4 md:gap-8 p-4 py-6 md:p-8 lg:p-12">
        <h1 className="text-4xl font-bold w-4/5 m-auto">{title}</h1>
        <span className="block m-auto w-4/5 mt-6 text-base">
          {formattedDate} &middot; {author.name}
        </span>
        <span></span>
        <Image data={data.blog.articleByHandle.image} className="mt-16" />
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
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
        publishedAt
        author {
          name
        }
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

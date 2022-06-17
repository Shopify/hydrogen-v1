import {
  useLocalization,
  useShopQuery,
  Seo,
  gql,
  Image,
  CacheLong,
} from '@shopify/hydrogen';

import {Layout, CustomFont} from '~/components';
import {ATTR_LOADING_EAGER} from '~/lib/const';

const BLOG_HANDLE = 'journal';

export default function Post({params, response}) {
  response.cache(CacheLong());
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {handle} = params;
  const {data} = useShopQuery({
    query: ARTICLE_QUERY,
    variables: {
      language: languageCode,
      blogHandle: BLOG_HANDLE,
      articleHandle: handle,
    },
  });

  const {title, publishedAt, contentHtml, author} = data.blog.articleByHandle;
  const formattedDate = new Intl.DateTimeFormat(
    `${languageCode}-${countryCode}`,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ).format(new Date(publishedAt));

  return (
    <Layout>
      {/* Loads Fraunces custom font only on articles */}
      <CustomFont />
      <Seo type="page" data={data.blog.articleByHandle} />
      <section className="w-[51rem] m-auto mt-12 max-w-full">
        <h1 className="text-4xl font-bold px-6 md:px-24">{title}</h1>
        <span className="block mt-6 px-6 md:px-24">
          {formattedDate} &middot; {author.name}
        </span>
        <Image
          data={data.blog.articleByHandle.image}
          className="mt-8 md:mt-16"
          loading={ATTR_LOADING_EAGER}
        />
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="mt-8 md:mt-16 px-6 md:px-24 mb-24 font-['Fraunces'] prose dark:prose-invert prose-strong:font-sans"
        />
      </section>
    </Layout>
  );
}

const ARTICLE_QUERY = gql`
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
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

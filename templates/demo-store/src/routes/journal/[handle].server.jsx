import {
  useShop,
  useShopQuery,
  Seo,
  gql,
  Image,
  CacheDays,
  Head,
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
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@100..900&display=swap"
          rel="stylesheet"
          preload="true"
        />
      </Head>
      <Seo type="page" data={data.blog.articleByHandle} />
      <section className="w-[51rem] m-auto mt-12 max-w-full">
        <h1 className="text-4xl font-bold px-6 md:px-24">{title}</h1>
        <span className="block mt-6 px-6 md:px-24">
          {formattedDate} &middot; {author.name}
        </span>
        <Image
          data={data.blog.articleByHandle.image}
          className="mt-8 md:mt-16"
        />
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="mt-8 md:mt-16 px-6 md:px-24 mb-24 font-['Fraunces'] prose-strong:font-sans"
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

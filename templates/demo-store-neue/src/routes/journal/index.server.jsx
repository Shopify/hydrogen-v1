import {
  useShop,
  useShopQuery,
  Seo,
  gql,
  Image,
  CacheLong,
  flattenConnection,
  Link,
  Head,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {Grid, PageHeader} from '~/components/elements';

const BLOG_HANDLE = 'Journal';

export default function Blog({pageBy = 12, response}) {
  response.cache(CacheLong());
  const {languageCode, locale} = useShop();

  const {data} = useShopQuery({
    query: BLOG_QUERY,
    variables: {
      language: languageCode,
      blogHandle: BLOG_HANDLE,
      pageBy,
    },
  });

  const rawArticles = flattenConnection(data.blog.articles);

  const articles = rawArticles.map((article) => {
    const {publishedAt} = article;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt)),
    };
  });

  const haveArticles = articles.length > 0;

  return (
    <Layout>
      <Head>
        <link rel="stylesheet" href="/src/styles/custom-font.css" />
      </Head>
      <Seo type="page" data={articles} />
      <PageHeader heading={BLOG_HANDLE}>
        {haveArticles ? (
          <Grid as="ol" layout="blog" gap="blog">
            {articles.map((article) => {
              return <ArticleCard article={article} key={article.id} />;
            })}
          </Grid>
        ) : (
          <p>No articles found</p>
        )}
      </PageHeader>
    </Layout>
  );
}

function ArticleCard({article}) {
  return (
    <li key={article.id} className="">
      <Link to={`/${BLOG_HANDLE.toLowerCase()}/${article.handle}`}>
        <Image data={article.image} className="mt-2 md:mt-4" />
        <h3 className="text-1xl font-bold">{article.title}</h3>
        <span className="block mt-3">
          {article.publishedAt} &middot; {article.author.name}
        </span>
      </Link>
    </li>
  );
}

const BLOG_QUERY = gql`
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $pageBy: Int!
    $cursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articles(first: $pageBy, after: $cursor) {
        edges {
          node {
            author: authorV2 {
              name
            }
            contentHtml
            handle
            id
            image {
              id
              altText
              url
              width
              height
            }
            publishedAt
            title
          }
        }
      }
    }
  }
`;

import {
  CacheLong,
  flattenConnection,
  gql,
  Head,
  Seo,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';

import {Layout, ArticleCard, Grid, PageHeader} from '~/components';

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
      <PageHeader heading={BLOG_HANDLE} className="gap-0">
        {haveArticles ? (
          <Grid as="ol" layout="blog" gap="blog">
            {articles.map((article) => {
              return (
                <ArticleCard
                  blogHandle={BLOG_HANDLE.toLowerCase()}
                  article={article}
                  key={article.id}
                />
              );
            })}
          </Grid>
        ) : (
          <p>No articles found</p>
        )}
      </PageHeader>
    </Layout>
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

import {useParams} from 'react-router-dom';
import {useShopQuery, RawHtml, Link} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/Layout.server';

export default function Blog() {
  const {handle} = useParams();
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  const blog = data.blogByHandle;

  return (
    <Layout>
      <div className="relative">
        <section className="my-8 px-4 pt-10 pb-4 text-white">
          <h1 className="text-7xl mb-4 font-semibold tracking-tight">
            {blog.title}
          </h1>
        </section>

        <section className="my-8 px-4 pb-4">
          <ul className="space-y-12 mt-8">
            {blog.articles.edges.map((edge) => {
              const article = edge.node;
              return (
                <li
                  key={article.id}
                  className="p-5 rounded-3xl overflow-hidden shadow-2xl bg-white bg-opacity-70"
                >
                  <h2 className="text-xl font-medium">
                    <Link to={`/blogs/${handle}/${article.handle}`}>
                      {article.title}
                    </Link>
                  </h2>
                  <p className="font-medium mt-1">
                    Published on{' '}
                    {new Date(article.publishedAt).toLocaleDateString()} by{' '}
                    {article.author.name}
                  </p>

                  <RawHtml
                    string={article.contentHtml}
                    className="mt-2 prose"
                  />
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Layout>
  );
}

const QUERY = gql`
  query BlogDetails($handle: String!) {
    blogByHandle(handle: $handle) {
      title
      articles(first: 10) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            contentHtml
            author {
              name
            }
          }
        }
      }
    }
  }
`;

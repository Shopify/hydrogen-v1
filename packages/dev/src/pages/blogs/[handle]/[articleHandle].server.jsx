import {RawHtml, useShopQuery} from '@shopify/hydrogen';
import {useParams} from 'react-router-dom';
import gql from 'graphql-tag';

import Layout from '../../../components/Layout.server';

export default function Article() {
  const {handle, articleHandle} = useParams();
  const {data} = useShopQuery({
    query: QUERY,
    variables: {handle, articleHandle},
  });

  const article = data.blogByHandle.articleByHandle;

  return (
    <Layout>
      <section className="my-8 px-4 pt-10 pb-4 text-white">
        <h1 className="text-7xl mb-4 font-semibold tracking-tight">
          {article.title}
        </h1>
      </section>

      <section className="my-8 bg-white rounded-3xl p-10 sticky shadow-2xl">
        <p className="font-medium mt-1">
          Published {new Date(article.publishedAt).toLocaleDateString()} by{' '}
          {article.author.name}
        </p>

        <RawHtml string={article.contentHtml} className="prose mt-8" />
      </section>
    </Layout>
  );
}

const QUERY = gql`
  query ArticleDetails($handle: String!, $articleHandle: String!) {
    blogByHandle(handle: $handle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
      }
    }
  }
`;

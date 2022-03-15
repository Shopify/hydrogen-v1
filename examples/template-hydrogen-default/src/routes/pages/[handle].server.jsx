import {useShopQuery, Seo} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';

export default function Page({params}) {
  const {handle} = params;
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  if (!data.pageByHandle) {
    return <NotFound />;
  }

  const page = data.pageByHandle;

  return (
    <Layout>
      <Seo type="page" data={page} />
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <div
        dangerouslySetInnerHTML={{_html: page.body}}
        className="prose mt-8"
      />
    </Layout>
  );
}

const QUERY = gql`
  query PageDetails($handle: String!) {
    pageByHandle(handle: $handle) {
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

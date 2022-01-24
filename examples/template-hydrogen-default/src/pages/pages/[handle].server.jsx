import {useShopQuery, RawHtml} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import PageSeo from '../../components/PageSeo.client';

export default function Page({params}) {
  const {handle} = params;
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  if (!data.pageByHandle) {
    return <NotFound />;
  }

  const page = data.pageByHandle;

  return (
    <Layout>
      <PageSeo page={page} />
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <RawHtml string={page.body} className="prose mt-8" />
    </Layout>
  );
}

const QUERY = gql`
  query PageDetails($handle: String!) {
    page(handle: $handle) {
      title
      body
      seo {
        title
        description
      }
    }
  }
`;

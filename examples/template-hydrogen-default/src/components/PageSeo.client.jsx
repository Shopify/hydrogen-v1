import PageLevelSeo from './PageLevelSeo.client';

export default function PageSeo({page}) {
  if (!page) {
    return null;
  }

  const title = page.seo?.title ?? page.title;
  const description = page.seo?.description;

  return <PageLevelSeo title={title} description={description} />;
}

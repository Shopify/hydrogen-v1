import {DefaultLayout as Layout} from '~/components/layouts';
import {
  PageHeader,
  FeaturedCollections,
  ProductSwimlane,
} from '~/components/sections';
import {Text, Button} from '~/components/elements';

export default function NotFound() {
  return (
    <Layout>
      <PageHeader heading="We’ve lost this page">
        <Text format width="narrow" as="p">
          We couldn’t find the page you’re looking for. Try checking the URL or
          heading back to the home page.
        </Text>
        <Button width="auto" variant="secondary" to={'/'}>
          Take me to the home page
        </Button>
      </PageHeader>
      <FeaturedCollections />
      <ProductSwimlane />
    </Layout>
  );
}

import {DefaultLayout as Layout} from '~/components/layouts';
import {
  PageHeader,
  FeaturedCollections,
  ProductSwimlane,
} from '~/components/sections';
import {Text, Button} from '~/components/elements';

export default function NotFound({type = 'page'}) {
  const heading = `We’ve lost this ${type}`;
  const description = `We couldn’t find the ${type} you’re looking for. Try checking the URL or heading back to the home page.`;

  return (
    <Layout>
      <PageHeader heading={heading}>
        <Text format width="narrow" as="p">
          {description}
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

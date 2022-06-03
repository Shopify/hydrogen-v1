import {DefaultLayout as Layout} from '~/components/layouts';
import {PageHeader, Section} from '~/components/sections';
import {Heading, Text, Button} from '~/components/elements';

export default function TemplateName() {
  return (
    <Layout>
      <PageHeader>{/* Header */}</PageHeader>
      <Section>{/* Page Section */}</Section>
    </Layout>
  );
}

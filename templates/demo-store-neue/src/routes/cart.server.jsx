import {Layout} from '~/components/layouts';
import {CartDetails} from '~/components/sections';
import {PageHeader, Section} from '~/components/elements';

export default function Cart() {
  return (
    <Layout>
      <PageHeader heading="Your Cart" />
      <Section padding="x">
        <CartDetails />
      </Section>
    </Layout>
  );
}

import {PageHeader, Section, CartDetails} from '~/components';
import {Layout} from '~/components/index.server';

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

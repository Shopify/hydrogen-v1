import {Layout, PageHeader, Section, CartDetails} from '~/components';

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

import {DefaultLayout as Layout} from '~/components/layouts';
import {PageHeader, Section} from '~/components/sections';
import CartDetails from '~/components/sections/CartDetails.client';

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

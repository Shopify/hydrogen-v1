import {Seo} from '@shopify/hydrogen';
import {PageHeader, Section, CartDetails} from '~/components';
import {Layout} from '~/components/index.server';

export default function Cart() {
  return (
    <Layout>
      <Seo type="page" data={{title: 'Cart'}} />
      <PageHeader heading="Your Cart" />
      <Section>
        <CartDetails layout="page" />
      </Section>
    </Layout>
  );
}

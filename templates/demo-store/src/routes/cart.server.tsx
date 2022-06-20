import {Seo} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {PageHeader, Section, CartDetails} from '~/components';
import {Layout} from '~/components/index.server';

export default function Cart() {
  return (
    <Layout>
      <Suspense>
        <Seo
          type="page"
          data={{
            title: 'Cart',
          }}
        />
      </Suspense>
      <PageHeader heading="Your Cart" />
      <Section padding="x">
        <CartDetails layout="page" />
      </Section>
    </Layout>
  );
}

import {Seo} from '@shopify/hydrogen';
import {PageHeader, Section, CartDetails} from '~/components';

export default function Cart() {
  return (
    <>
      <Seo type="page" data={{title: 'Cart'}} />
      <PageHeader heading="Your Cart" className="max-w-7xl mx-auto" />
      <Section className="max-w-7xl mx-auto">
        <CartDetails layout="page" />
      </Section>
    </>
  );
}

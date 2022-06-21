import {fetchSync} from '@shopify/hydrogen';
import {Button, Text, ProductCard, Heading} from '~/components';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';

export function CartEmpty({onClose}: {onClose?: () => void}) {
  return (
    <div className="flex flex-col md:py-8 md:px-12 px-4 py-6 h-screen overflow-auto">
      <section className="h-1/4">
        <Text>
          Looks like you haven&apos;t added anything yet, let&apos;s get you
          started!
        </Text>
        <div>
          <Button onClick={onClose}>Continue shopping</Button>
        </div>
      </section>
      <section className="flex flex-col h-3/4">
        <Heading size="copy">Best sellers</Heading>
        <div className="grid gap-6 grid-cols-2">
          <Suspense>
            <TopProducts />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function TopProducts() {
  const products: Product[] = fetchSync('/api/bestSellers').json();
  return (
    <>
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </>
  );
}

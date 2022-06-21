import {fetchSync} from '@shopify/hydrogen';
import {Button, Text, ProductCard, Heading} from '~/components';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';

export function CartEmpty({onClose}: {onClose?: () => void}) {
  return (
    <div className="grid gap-1 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <Text>
        Looks like you haven&apos;t added anything yet, let&apos;s get you
        started!
      </Text>
      <Button onClick={onClose}>Continue shopping</Button>
      <Heading size="copy">Best sellers</Heading>
      <div className="grid gap-2 grid-cols-2">
        <Suspense>
          <TopProducts />
        </Suspense>
      </div>
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

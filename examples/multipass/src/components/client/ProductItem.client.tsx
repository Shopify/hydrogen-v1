import React from 'react';
import {Form} from '@shopify/hydrogen/experimental';
import {useCart} from '@shopify/hydrogen';

export function ProductItem({product}) {
  const firstVariant = product.variants.edges[0].node;
  const {linesAdd} = useCart();

  async function addToCart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    linesAdd([
      {
        merchandiseId: firstVariant.id,
        quantity: 1,
      },
    ]);
  }

  return (
    <Form onSubmit={addToCart}>
      <p>{product.title}</p>
      <button disabled={!firstVariant.availableForSale} type="submit">
        Add
      </button>
    </Form>
  );
}

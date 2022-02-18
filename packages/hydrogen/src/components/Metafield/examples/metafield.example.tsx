import {Metafield} from '@shopify/hydrogen';

export function Product({product}) {
  const metafield = product.metafields.edges.map(({node}) => node)[0];

  return <Metafield data={metafield} />;
}

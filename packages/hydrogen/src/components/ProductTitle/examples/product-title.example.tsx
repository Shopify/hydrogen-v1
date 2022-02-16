import {ProductTitle, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductTitle />
    </ProductProvider>
  );
}

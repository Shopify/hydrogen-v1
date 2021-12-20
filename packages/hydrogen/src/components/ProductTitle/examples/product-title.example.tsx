import {ProductTitle, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider value={product}>
      <ProductTitle />
    </ProductProvider>
  );
}

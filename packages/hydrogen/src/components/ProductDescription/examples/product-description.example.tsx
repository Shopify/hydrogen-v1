import {ProductDescription, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductDescription />
    </ProductProvider>
  );
}

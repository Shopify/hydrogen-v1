import {ProductPrice, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductPrice priceType="compareAt" valueType="max" />
    </ProductProvider>
  );
}

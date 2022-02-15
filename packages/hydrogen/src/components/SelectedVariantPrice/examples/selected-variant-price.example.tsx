import {SelectedVariantPrice, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      <SelectedVariantPrice priceType="compareAt" />
    </ProductProvider>
  );
}

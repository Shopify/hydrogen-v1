import {SelectedVariantPrice, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <SelectedVariantPrice priceType="compareAt" />
    </ProductProvider>
  );
}

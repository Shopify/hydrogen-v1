import {SelectedVariantImage, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <SelectedVariantImage />
    </ProductProvider>
  );
}

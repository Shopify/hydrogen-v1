import {SelectedVariantImage, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      <SelectedVariantImage />
    </ProductProvider>
  );
}

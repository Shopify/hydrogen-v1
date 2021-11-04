import {SelectedVariantUnitPrice, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <SelectedVariantUnitPrice />
    </ProductProvider>
  );
}

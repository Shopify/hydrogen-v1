import {SelectedVariantUnitPrice, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      <SelectedVariantUnitPrice />
    </ProductProvider>
  );
}

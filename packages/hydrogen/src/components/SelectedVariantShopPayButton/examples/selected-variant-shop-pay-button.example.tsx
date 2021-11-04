import {SelectedVariantShopPayButton, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      {/* Code for selecting the product variant */}
      <SelectedVariantShopPayButton />
    </ProductProvider>
  );
}

import {SelectedVariantShopPayButton, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      {/* Code for selecting the product variant */}
      <SelectedVariantShopPayButton />
    </ProductProvider>
  );
}

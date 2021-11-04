import {SelectedVariantBuyNowButton, ProductProvider, useProduct} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <SelectedVariantBuyNowButton>Buy it now</SelectedVariantBuyNowButton>
    </ProductProvider>
  );
}

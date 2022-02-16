import {
  SelectedVariantBuyNowButton,
  ProductProvider,
  useProduct,
} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      <SelectedVariantBuyNowButton>Buy it now</SelectedVariantBuyNowButton>
    </ProductProvider>
  );
}

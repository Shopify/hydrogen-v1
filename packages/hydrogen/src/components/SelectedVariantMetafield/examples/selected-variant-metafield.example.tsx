import {ProductProvider, SelectedVariantMetafield} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <SelectedVariantMetafield
        namespace="my_fields"
        keyName="manufacture_date"
      />
    </ProductProvider>
  );
}

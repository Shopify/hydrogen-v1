import {ProductProvider, ProductMetafield} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductMetafield namespace="my_fields" keyName="manufacture_date" />
    </ProductProvider>
  );
}

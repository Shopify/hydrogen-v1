import {ProductProvider, ProductMetafield} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider product={product}>
      <ProductMetafield namespace="my_fields" keyName="manufacture_date" />
    </ProductProvider>
  );
}

export function ProductWithRenderProp({product}) {
  return (
    <ProductProvider product={product}>
      <ProductMetafield namespace="my_fields" keyName="manufacture_date">
        {({value}) => {
          return <p>This product was manufactured on {value.toLocaleDateString()}</p>
        }}
      </ProductMetafield>
    </ProductProvider>
  );
}

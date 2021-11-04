import {ProductProvider, SelectedVariantMetafield} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider product={product}>
      <SelectedVariantMetafield
        namespace="my_fields"
        keyName="manufacture_date"
      />
    </ProductProvider>
  );
}

export function ProductWithRenderProp({product}) {
  return (
    <ProductProvider product={product}>
      <SelectedVariantMetafield
        namespace="my_fields"
        keyName="manufacture_date"
      >
        {({value}) => {
          return (
            <p>This variant was manufactured on {value.toLocaleDateString()}</p>
          );
        }}
      </SelectedVariantMetafield>
    </ProductProvider>
  );
}

import {ProductDescription, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider value={product}>
      <ProductDescription />
    </ProductProvider>
  )
}

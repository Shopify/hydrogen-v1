import {ProductPrice, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider value={product}>
      <ProductPrice priceType="compareAt" valueType="max" />
    </ProductProvider>
  )
}

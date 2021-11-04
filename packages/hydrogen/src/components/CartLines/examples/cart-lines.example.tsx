import {CartLines, CartLineImage, CartLineProductTitle, CartLinePrice, Link} from '@shopify/hydrogen';

export function MyComponent() {
  return (
    <CartLines>
      <CartLineImage />
      <CartLineProductTitle />
      <CartLinePrice />
    </CartLines>
  )
}

export function MyComponentWithRenderProps() {
  return (
    <CartLines>
      {({merchandise}) => (
        <Link to={`/product/${merchandise.handle}`}>{merchandise.product.title}</Link>
      )}
    </CartLines>
  )
}

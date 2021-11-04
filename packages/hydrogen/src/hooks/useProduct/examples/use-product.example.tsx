import {useProduct} from '@shopify/hydrogen';

export function CustomAddToCartButton() {
  const {title, description} = useProduct();

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
}

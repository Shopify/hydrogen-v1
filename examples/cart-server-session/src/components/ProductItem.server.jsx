import {AddToCart} from '~/components/AddToCart.server';

export function ProductItem({id, title, image, variant}) {
  return (
    <div>
      <img src={image} width={100} />
      <p style={{marginBottom: '.25rem'}}>{title}</p>

      <AddToCart id={id} variant={variant} />
    </div>
  );
}

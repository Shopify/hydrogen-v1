import {Image, Link} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Text} from '../elements';

export default function ProductCard({product, className}) {
  const {compareAtPrice, price, handle, label, createdAt, image, title} =
    product;

  let cardLabel;
  var today = new Date();
  var newArrivalDate = new Date(new Date().setDate(today.getDate() - 30));

  if (label) {
    cardLabel = label;
  } else if (compareAtPrice.amount > price.amount) {
    cardLabel = 'Sale';
  } else if (createdAt > newArrivalDate) {
    cardLabel = 'New';
  }

  const styles = clsx('grid gap-6', className);

  return (
    <Link to={`/products/${handle}`}>
      <div className={styles}>
        <div className="relative rounded overflow-clip image-border">
          <Text
            as="label"
            className="absolute top-0 right-0 m-4 leading-none text-right text-notice"
          >
            {cardLabel}
          </Text>
          <Image
            width={336}
            height={424}
            className="aspect-[4/5] "
            src={image}
            alt="Alt Tag"
          />
        </div>
        <div className="grid gap-2">
          <Text
            className="w-full overflow-hidden leading-none whitespace-nowrap text-ellipsis "
            as="h3"
          >
            {title}
          </Text>
          <div className="flex gap-4">
            <div className="flex gap-4">
              <Text>
                {price.symbol}
                {price.amount}
              </Text>
              {compareAtPrice.amount > price.amount && (
                <Text className="opacity-50 strike">
                  {compareAtPrice.symbol}
                  {compareAtPrice.amount}
                </Text>
              )}
            </div>
            <Text className="opacity-50">11 Colors Available</Text>
          </div>
        </div>
      </div>
    </Link>
  );
}

import {Image, Link, Money, useMoney, gql} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Text} from '~/components/elements';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {product as mockProduct} from '~/lib/placeholders';

export default function ProductCard({product, label, className}) {
  let cardLabel;

  const cardData = product?.variants ? product : mockProduct;

  const {
    image,
    priceV2: price,
    compareAtPriceV2: compareAtPrice,
  } = cardData?.variants?.nodes[0];

  if (label) {
    cardLabel = label;
  } else if (price.amount > compareAtPrice?.amount) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const styles = clsx('grid gap-6', className);

  return (
    <Link to={`/products/${product.handle}`}>
      <div className={styles}>
        <div className="card-image">
          <Text
            as="label"
            size="fine"
            className="absolute top-0 right-0 m-4 text-right text-notice"
          >
            {cardLabel}
          </Text>
          {image && (
            <Image className="aspect-[4/5]" data={image} alt="Alt Tag" />
          )}
        </div>
        <div className="grid gap-1">
          <Text
            className="w-full overflow-hidden whitespace-nowrap text-ellipsis "
            as="h3"
          >
            {product.title}
          </Text>
          <div className="flex gap-4">
            <Text className="flex gap-4">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted(price, compareAtPrice) && (
                <CompareAtPrice
                  className={'opacity-50'}
                  data={compareAtPrice}
                />
              )}
            </Text>
          </div>
        </div>
      </div>
    </Link>
  );
}

// <Money className="opacity-50 strike" data={compareAtPrice} />
function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

import clsx from 'clsx';
import {Image, Link, Money, useMoney} from '@shopify/hydrogen';

import {Text} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {withPlaceholder} from '~/lib/placeholders';

export function ProductCard({product, label, className, loading}) {
  let cardLabel;

  const cardData = product?.variants ? product : withPlaceholder('PRODUCT');

  const {
    image,
    priceV2: price,
    compareAtPriceV2: compareAtPrice,
  } = cardData?.variants?.nodes[0] || {};

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
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
            <Image
              className="aspect-[4/5]"
              data={image}
              alt={image.altText || `Picture of ${product.title}`}
              loading={loading}
            />
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

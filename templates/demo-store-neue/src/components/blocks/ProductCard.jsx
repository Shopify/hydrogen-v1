import clsx from 'clsx';
import {useMemo} from 'react';
import {Image, Link, Money, useMoney} from '@shopify/hydrogen';

import {Text} from '~/components/elements';
import {isDiscounted, isNewArrival} from '~/lib/utils';

export function ProductCard({product, label, className}) {
  if (!product?.variants?.nodes) return null;

  const firstVariant = product.variants.nodes[0];
  const {image, priceV2, compareAtPriceV2} = firstVariant;

  const cardLabel = useMemo(() => {
    switch (true) {
      case label:
        return label;

      case compareAtPriceV2?.amount &&
        priceV2.amount > compareAtPriceV2?.amount:
        return 'Sale';

      case isNewArrival(product.publishedAt):
        return 'New';

      default:
        return null;
    }
  }, [label, product?.publishedAt, priceV2.amount, compareAtPriceV2?.amount]);

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
            <Image className="aspect-[4/5]" data={image} alt={product.title} />
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
              <Money withoutTrailingZeros data={priceV2} />
              {isDiscounted(priceV2, compareAtPriceV2) && (
                <CompareAtPrice
                  className={'opacity-50'}
                  data={compareAtPriceV2}
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
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} = useMoney(
    data,
  );

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

CompareAtPrice.displayName = 'CompareAtPrice';

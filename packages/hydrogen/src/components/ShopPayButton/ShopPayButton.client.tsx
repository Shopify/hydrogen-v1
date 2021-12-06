import React, {useEffect, useState} from 'react';
import {useShop} from '../../foundation/useShop';
import {loadScript} from '../../utilities';

export interface ShopPayButtonProps {
  /** An array of IDs of the variants to purchase with Shop Pay. */
  variantIds: string[];
  /** A string of classes to apply to the `div` that wraps the Shop Pay button. */
  className?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'shop-pay-button': {
        variants: string;
        'store-url': string;
      };
    }
  }
}

const URL = 'https://cdn.shopify.com/shopifycloud/shop-js/v0.1/client.js';

/**
 * The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout.
 */
export function ShopPayButton({variantIds, className}: ShopPayButtonProps) {
  const [ids, setIds] = useState<string[]>([]);
  const [shopPayLoaded, setShopPayLoaded] = useState<boolean>(false);

  const {storeDomain} = useShop();

  useEffect(() => {
    const ids = variantIds.reduce<string[]>((accumulator, gid) => {
      const id = atob(gid).split('/').pop();
      if (id) {
        accumulator.push(id);
      }
      return accumulator;
    }, []);
    setIds(ids);
  }, [variantIds]);

  useEffect(() => {
    async function loadShopPay() {
      const loaded = await loadScript(URL, {
        module: true,
      });

      if (!loaded) {
        console.warn('shop-pay-button library did not load');
      }

      setShopPayLoaded(true);
    }

    loadShopPay();
  }, []);

  return (
    <div className={className} tabIndex={1}>
      {shopPayLoaded && (
        <shop-pay-button
          store-url={`https://${storeDomain}`}
          variants={ids.join(',')}
        />
      )}
    </div>
  );
}

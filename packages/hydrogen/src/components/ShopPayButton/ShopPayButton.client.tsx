import React from 'react';
import {useShop} from '../../foundation/useShop';
import {useLoadScript} from '../../hooks/useLoadScript/useLoadScript';

type VariantIdAndQuantity = {
  id: string;
  quantity: number;
};

// By using 'never' in the "or" cases below, it makes these props "exclusive" and means that you cannot pass both of them; you must pass either one OR the other.
export type ShopPayButtonProps = {
  /** A string of classes to apply to the `div` that wraps the Shop Pay button. */
  className?: string;
} & (
  | {
      /** An array of IDs of the variants to purchase with Shop Pay. This will only ever have a quantity of 1 for each variant. If you want to use other quantities, then use 'variantIdsAndQuantities'. */
      variantIds: string[];
      /** An array of variant IDs and quantities to purchase with Shop Pay. */
      variantIdsAndQuantities?: never;
    }
  | {
      /** An array of IDs of the variants to purchase with Shop Pay. This will only ever have a quantity of 1 for each variant. If you want to use other quantities, then use 'variantIdsAndQuantities'. */
      variantIds?: never;
      /** An array of variant IDs and quantities to purchase with Shop Pay. */
      variantIdsAndQuantities: VariantIdAndQuantity[];
    }
);

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

const URL = 'https://cdn.shopify.com/shopifycloud/shop-js/v0.8/client.js';

/**
 * The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout.
 */
export function ShopPayButton({
  variantIds,
  className,
  variantIdsAndQuantities,
}: ShopPayButtonProps) {
  const {storeDomain} = useShop();
  const shopPayLoadedStatus = useLoadScript(URL);

  let ids: string[];

  if (variantIds && variantIdsAndQuantities) {
    throw new Error(
      `You must provide either a variantIds or variantIdsAndQuantities prop, but not both in the ShopPayButton component`
    );
  }

  if (variantIds) {
    ids = variantIds.reduce<string[]>((prev, curr) => {
      const bareId = getIdFromGid(curr);
      if (bareId) {
        prev.push(bareId);
      }
      return prev;
    }, []);
  } else if (variantIdsAndQuantities) {
    ids = variantIdsAndQuantities.reduce<string[]>((prev, curr) => {
      const bareId = getIdFromGid(curr?.id);
      if (bareId) {
        prev.push(`${bareId}:${curr?.quantity ?? 1}`);
      }
      return prev;
    }, []);
  } else {
    throw new Error(
      `You must pass in either "variantIds" or "variantIdsAndQuantities" to ShopPayButton`
    );
  }

  return (
    <div className={className} tabIndex={1}>
      {shopPayLoadedStatus === 'done' && (
        <shop-pay-button
          store-url={`https://${storeDomain}`}
          variants={ids.join(',')}
        />
      )}
    </div>
  );
}

/**
 * Takes a string in the format of "gid://shopify/ProductVariant/41007289630776" and returns a string of the ID part at the end: "41007289630776"
 */
function getIdFromGid(id: string) {
  // atob() required for SFAPI 2022-01. Remove atob() when upgrading to 2022-04
  return atob(id).split('/').pop();
}

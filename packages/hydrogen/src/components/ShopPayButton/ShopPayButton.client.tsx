import React from 'react';
import {useShop} from '../../foundation/useShop/index.js';
import {useLoadScript} from '../../hooks/useLoadScript/useLoadScript.client.js';

// By using 'never' in the "or" cases below, it makes these props "exclusive" and means that you cannot pass both of them; you must pass either one OR the other.
type ShopPayButtonProps = {
  /** A string of classes to apply to the `div` that wraps the Shop Pay button. */
  className?: string;
  /** A string that's applied to the [CSS custom property (variable)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) `--shop-pay-button-width` for the [Buy with Shop Pay component](https://shopify.dev/custom-storefronts/tools/web-components#buy-with-shop-pay-component). */
  width?: string;
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
      variantIdsAndQuantities: Array<{
        id: string;
        quantity: number;
      }>;
    }
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'shop-pay-button': {
        variants: string;
        'store-url': string;
      };
    }
  }
}

const URL = 'https://cdn.shopify.com/shopifycloud/shop-js/v1.0/client.js';

/**
 * The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout.
 */
export function ShopPayButton({
  variantIds,
  className,
  variantIdsAndQuantities,
  width,
}: ShopPayButtonProps) {
  const {storeDomain} = useShop();
  const shopPayLoadedStatus = useLoadScript(URL);

  let ids: string[];

  if (variantIds && variantIdsAndQuantities) {
    throw new Error(DoublePropsErrorMessage);
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
    throw new Error(MissingPropsErrorMessage);
  }

  const style = width
    ? ({
        '--shop-pay-button-width': width,
      } as React.CSSProperties)
    : undefined;

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    <div className={className} tabIndex={0} style={style}>
      {shopPayLoadedStatus === 'done' && (
        <shop-pay-button
          store-url={`https://${storeDomain}`}
          variants={ids.join(',')}
        />
      )}
    </div>
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
  );
}

/**
 * Takes a string in the format of "gid://shopify/ProductVariant/41007289630776" and returns a string of the ID part at the end: "41007289630776"
 */
export function getIdFromGid(id?: string) {
  if (!id) return;
  return id.split('/').pop();
}

export const MissingPropsErrorMessage = `You must pass in either "variantIds" or "variantIdsAndQuantities" to ShopPayButton`;
export const DoublePropsErrorMessage = `You must provide either a variantIds or variantIdsAndQuantities prop, but not both in the ShopPayButton component`;

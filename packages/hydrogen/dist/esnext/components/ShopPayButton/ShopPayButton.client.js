import React from 'react';
import { useShop } from '../../foundation/useShop';
import { useLoadScript } from '../../hooks/useLoadScript/useLoadScript.client';
const URL = 'https://cdn.shopify.com/shopifycloud/shop-js/v1.0/client.js';
/**
 * The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout.
 */
export function ShopPayButton({ variantIds, className, variantIdsAndQuantities, width, }) {
    const { storeDomain } = useShop();
    const shopPayLoadedStatus = useLoadScript(URL);
    let ids;
    if (variantIds && variantIdsAndQuantities) {
        throw new Error(DoublePropsErrorMessage);
    }
    if (variantIds) {
        ids = variantIds.reduce((prev, curr) => {
            const bareId = getIdFromGid(curr);
            if (bareId) {
                prev.push(bareId);
            }
            return prev;
        }, []);
    }
    else if (variantIdsAndQuantities) {
        ids = variantIdsAndQuantities.reduce((prev, curr) => {
            const bareId = getIdFromGid(curr?.id);
            if (bareId) {
                prev.push(`${bareId}:${curr?.quantity ?? 1}`);
            }
            return prev;
        }, []);
    }
    else {
        throw new Error(MissingPropsErrorMessage);
    }
    const style = width
        ? {
            '--shop-pay-button-width': width,
        }
        : undefined;
    return (
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    React.createElement("div", { className: className, tabIndex: 0, style: style }, shopPayLoadedStatus === 'done' && (React.createElement("shop-pay-button", { "store-url": `https://${storeDomain}`, variants: ids.join(',') })))
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    );
}
/**
 * Takes a string in the format of "gid://shopify/ProductVariant/41007289630776" and returns a string of the ID part at the end: "41007289630776"
 */
export function getIdFromGid(id) {
    if (!id)
        return;
    return id.split('/').pop();
}
export const MissingPropsErrorMessage = `You must pass in either "variantIds" or "variantIdsAndQuantities" to ShopPayButton`;
export const DoublePropsErrorMessage = `You must provide either a variantIds or variantIdsAndQuantities prop, but not both in the ShopPayButton component`;

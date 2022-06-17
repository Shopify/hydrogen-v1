import React from 'react';
import { ShopPayButton } from '../ShopPayButton';
/**
 * The `CartShopPayButton` component renders a `ShopPayButton` for the items in the cart.
 * It must be a descendent of a `CartProvider` component.
 */
export declare function CartShopPayButton(props: Omit<React.ComponentProps<typeof ShopPayButton>, 'variantIds'>): JSX.Element;

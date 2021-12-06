export {Link} from './Link';
export type {MediaFileProps} from './MediaFile';
export {MediaFile, MediaFileFragment} from './MediaFile';
export type {VideoProps} from './Video';
export {Video} from './Video';
export type {ImageProps} from './Image';
export {Image} from './Image';
export type {ExternalVideoProps} from './ExternalVideo';
export {ExternalVideo} from './ExternalVideo';
export type {RawHtmlProps} from './RawHtml';
export {RawHtml} from './RawHtml';
export type {AddToCartButtonProps} from './AddToCartButton';
export {AddToCartButton} from './AddToCartButton';
export type {Model3DProps} from './Model3D';
export {Model3D} from './Model3D';
export type {MoneyProps} from './Money';
export {Money} from './Money';
export {Metafield} from './Metafield';
export type {MetafieldType, MetafieldFragmentFragment} from './Metafield';
export {CartLineProvider, useCartLine} from './CartLineProvider';
export {CartLineImage} from './CartLineImage';
export {CartLinePrice} from './CartLinePrice';
export {CartLineProductTitle} from './CartLineProductTitle';
export {CartLineQuantity} from './CartLineQuantity';
export {CartLineQuantityAdjustButton} from './CartLineQuantityAdjustButton';
export {CartLineAttributes} from './CartLineAttributes';
export {CartLines} from './CartLines';
export {CartCheckoutButton} from './CartCheckoutButton';
export {CartShopPayButton} from './CartShopPayButton';
export {CartEstimatedCost} from './CartEstimatedCost';
export {
  CartProvider,
  useCart,
  useCartAttributesUpdateCallback,
  useCartBuyerIdentityUpdateCallback,
  useCartNoteUpdateCallback,
  useCartCheckoutUrl,
  useCartCreateCallback,
  useCartDiscountCodesUpdateCallback,
  useCartFetch,
  useCartLinesAddCallback,
  useCartLinesRemoveCallback,
  useCartLinesTotalQuantity,
  useCartLinesUpdateCallback,
  useInstantCheckout,
} from './CartProvider';
export type {
  State,
  Status,
  Cart,
  CartWithActions,
  CartAction,
} from './CartProvider';
export {
  ProductProvider,
  useProduct,
  ProductProviderFragment,
} from './ProductProvider';
export {ProductDescription} from './ProductDescription';
export {ProductTitle} from './ProductTitle';
export {SelectedVariantPrice} from './SelectedVariantPrice';
export {SelectedVariantAddToCartButton} from './SelectedVariantAddToCartButton';
export {SelectedVariantBuyNowButton} from './SelectedVariantBuyNowButton';
export {SelectedVariantShopPayButton} from './SelectedVariantShopPayButton';
export {SelectedVariantImage} from './SelectedVariantImage';
export type {
  BuyNowButtonProps,
  BuyNowButtonPropsWeControl,
} from './BuyNowButton';
export {BuyNowButton} from './BuyNowButton';
export type {ShopPayButtonProps} from './ShopPayButton';
export {ShopPayButton} from './ShopPayButton';
export {useAvailableCountries} from '../hooks/useAvailableCountries';
export {useCountry} from '../hooks/useCountry';

/**
 * Provide namespaced aliases for the `Product` group.
 */

import {ProductProvider} from './ProductProvider';
import {ProductPrice} from './ProductPrice';
import {ProductDescription} from './ProductDescription';
import {ProductTitle} from './ProductTitle';
import {ProductMetafield} from './ProductMetafield';
import {SelectedVariantAddToCartButton} from './SelectedVariantAddToCartButton';
import {SelectedVariantBuyNowButton} from './SelectedVariantBuyNowButton';
import {SelectedVariantShopPayButton} from './SelectedVariantShopPayButton';
import {SelectedVariantImage} from './SelectedVariantImage';
import {SelectedVariantPrice} from './SelectedVariantPrice';
import {SelectedVariantUnitPrice} from './SelectedVariantUnitPrice';
import {SelectedVariantMetafield} from './SelectedVariantMetafield';

export const Product: Function & Record<string, any> = ProductProvider;
Product.Description = ProductDescription;
Product.Price = ProductPrice;
Product.Title = ProductTitle;
Product.Metafield = ProductMetafield;
Product.SelectedVariant = {
  AddToCartButton: SelectedVariantAddToCartButton,
  BuyNowButton: SelectedVariantBuyNowButton,
  ShopPayButton: SelectedVariantShopPayButton,
  Price: SelectedVariantPrice,
  Image: SelectedVariantImage,
  UnitPrice: SelectedVariantUnitPrice,
  Metafield: SelectedVariantMetafield,
};

/**
 * Provide namespaced aliases for the `CartLine` group.
 */

import {CartLineProvider} from './CartLineProvider';
import {CartLineImage} from './CartLineImage';
import {CartLinePrice} from './CartLinePrice';
import {CartLineProductTitle} from './CartLineProductTitle';
import {CartLineQuantity} from './CartLineQuantity';
import {CartLineQuantityAdjustButton} from './CartLineQuantityAdjustButton';
import {CartLineSelectedOptions} from './CartLineSelectedOptions';
import {CartLineAttributes} from './CartLineAttributes';

export const CartLine: Function & Record<string, any> = CartLineProvider;
CartLine.Image = CartLineImage;
CartLine.Price = CartLinePrice;
CartLine.ProductTitle = CartLineProductTitle;
CartLine.Quantity = CartLineQuantity;
CartLine.QuantityAdjustButton = CartLineQuantityAdjustButton;
CartLine.SelectedOptions = CartLineSelectedOptions;
CartLine.Attributes = CartLineAttributes;

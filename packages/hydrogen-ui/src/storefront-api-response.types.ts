import type {FormattedExecutionResult} from 'graphql';
import type {PartialDeep} from 'type-fest';

/**
 * Provides more information about the error(s) including properties and metadata.
 * Refer to https://shopify.dev/api/storefront#status_and_error_codes for more information.
 */
type StorefrontApiExtensions = {
  /**
   * Shows error codes common to Shopify. Additional error codes may also be shown.
   * https://shopify.dev/api/storefront#status_and_error_codes
   */
  code?:
    | 'THROTTLED'
    | 'ACCESS_DENIED'
    | 'SHOP_INACTIVE'
    | 'INTERNAL_SERVER_ERROR'
    | string;
};

/**
 * The Storefront API can return a 200 OK response code when the query succeeds, and will populate the `data` property. The generic you pass in through type parameters will be the shape of the `data` object if successful. If you prefer a "deeply-partial" version of that generic object, consider using `StorefrontApiResponseOkPartial` instead.
 *
 * The Storefront API can also return a 200 OK response code in cases that would typically produce 4xx errors in REST. This will propulate the `errors` property.
 *
 * Refer to https://shopify.dev/api/storefront#status_and_error_codes for more information.
 */
export type StorefrontApiResponseOk<DataGeneric> = FormattedExecutionResult<
  DataGeneric,
  StorefrontApiExtensions
>;

/**
 * The Storefront API can return a 200 OK response code when the query succeeds, and will populate the `data` property. The generic you pass in through type parameters will be the shape of the `data` object, with `Partial` deeply-applied to all nested objects and properties, if successful. If you prefer not using this "deeply-partial" generic data object, consider using `StorefrontApiResponseOk` instead.
 *
 * The Storefront API can also return a 200 OK response code in cases that would typically produce 4xx errors in REST. This will propulate the `errors` property.
 *
 * Refer to https://shopify.dev/api/storefront#status_and_error_codes for more information.
 */
export type StorefrontApiResponseOkPartial<DataGeneric> =
  FormattedExecutionResult<PartialDeep<DataGeneric>, StorefrontApiExtensions>;

/**
 * The 4xx and 5xx errors occur infrequently. They are often related to network communications, your account, or an issue with Shopify’s services.
 *
 * Many errors that would typically return a 4xx or 5xx status code, return an HTTP 200 errors response instead. Refer to the 200 OK section in the link below for details.
 *
 * Commonly the response is a `JSON.parse`-able string, but in rare occasions may also return HTML which is not `JSON.parse()`-able.
 *
 * Refer to https://shopify.dev/api/storefront#status_and_error_codes for more information.
 */
export type StorefrontApiResponseError =
  | string
  | {
      errors: {query: string};
    }
  | {errors: string};

/**
 * The Storefront API can return a 200 OK response code when the query succeeds, and will populate the `data` property. The generic you pass in through type parameters will be the shape of the `data` object if successful. If you prefer a "deeply-partial" version of that generic object, consider using `StorefrontApiResponseOkPartial` instead.
 *
 * The Storefront API can also return a 200 OK response code in cases that would typically produce 4xx errors in REST. This will propulate the `errors` property.
 *
 * 4xx and 5xx errors occur infrequently. They are often related to network communications, your account, or an issue with Shopify’s services.  Commonly the response is a `JSON.parse`-able string, but in rare occasions may also return HTML which is not `JSON.parse()`-able.
 *
 * Refer to https://shopify.dev/api/storefront#status_and_error_codes for more information.
 */
export type StorefrontApiResponse<DataGeneric> =
  | StorefrontApiResponseOk<DataGeneric>
  | StorefrontApiResponseError;

/**
 * The Storefront API can return a 200 OK response code when the query succeeds, and will populate the `data` property. The generic you pass in through type parameters will be the shape of the `data` object, with `Partial` deeply-applied to all nested objects and properties, if successful. If you prefer not using this "deeply-partial" generic data object, consider using `StorefrontApiResponseOk` instead.
 *
 * The Storefront API can also return a 200 OK response code in cases that would typically produce 4xx errors in REST. This will propulate the `errors` property.
 *
 * 4xx and 5xx errors occur infrequently. They are often related to network communications, your account, or an issue with Shopify’s services. Commonly the response is a `JSON.parse`-able string, but in rare occasions may also return HTML which is not `JSON.parse()`-able.
 *
 * Refer to https://shopify.dev/api/storefront#status_and_error_codes for more information.
 */
export type StorefrontApiResponsePartial<DataGeneric> =
  | StorefrontApiResponseOkPartial<DataGeneric>
  | StorefrontApiResponseError;

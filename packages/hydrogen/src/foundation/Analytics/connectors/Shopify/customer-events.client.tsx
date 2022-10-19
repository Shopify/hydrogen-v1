import {
  buildUUID,
  addDataIf,
  getNavigationType,
  stripGId,
  stripId,
} from './utils.js';
import {
  ShopifyAnalyticsConstants,
  PAGE_RENDERED_EVENT_NAME,
  COLLECTION_PAGE_RENDERED_EVENT_NAME,
  PRODUCT_PAGE_RENDERED_EVENT_NAME,
  PRODUCT_ADDED_TO_CART_EVENT_NAME,
  SEARCH_SUBMITTED_EVENT_NAME,
} from './const.js';
import {flattenConnection} from '../../../../utilities/flattenConnection/index.js';
import {CartLine, CartLineInput} from '../../../../storefront-api-types.js';

const DOC_URL =
  'https://shopify.dev/api/hydrogen/components/framework/shopifyanalytics';
const requiredProductFields: Record<string, string>[] = [
  {
    column: 'product_gid',
    gqlField: 'product.id',
  },
  {
    column: 'variant_gid',
    gqlField: 'variant.id',
  },
  {
    column: 'name',
    gqlField: 'product.title',
  },
  {
    column: 'variant',
    gqlField: 'variant.title',
  },
  {
    column: 'brand',
    gqlField: 'product.vendor',
  },
  {
    column: 'price',
    gqlField: 'variant.priceV2.amount',
  },
];

let customerId = '';

export function trackCustomerPageView(
  payload: any,
  sendToServer: (payload: any) => void
) {
  const shopify = payload.shopify;
  const canonicalUrl = shopify.canonicalPath
    ? `${location.origin}${shopify.canonicalPath}`
    : location.href;

  // Only the /account/index route sets the `customerId`, so we persist this value when it's available
  // and append it to analytics events only when a customer is in the logged in state (provided by `CartProvider`).
  if (payload.shopify.customerId) {
    customerId = payload.shopify.customerId;
  }

  sendToServer(
    customerEventSchema(payload, PAGE_RENDERED_EVENT_NAME, {
      canonical_url: canonicalUrl,
    })
  );

  if (shopify.pageType === ShopifyAnalyticsConstants.pageType.product) {
    sendToServer(
      customerEventSchema(payload, PRODUCT_PAGE_RENDERED_EVENT_NAME, {
        products: formatProductsJSON(shopify.products),
        canonical_url: canonicalUrl,
        total_value: parseFloat(shopify.products[0].price),
      })
    );
  }

  if (shopify.pageType === ShopifyAnalyticsConstants.pageType.collection) {
    sendToServer(
      customerEventSchema(payload, COLLECTION_PAGE_RENDERED_EVENT_NAME, {
        collection_name: shopify.collectionHandle,
        canonical_url: canonicalUrl,
      })
    );
  }

  if (shopify.pageType === ShopifyAnalyticsConstants.pageType.search) {
    sendToServer(
      customerEventSchema(payload, SEARCH_SUBMITTED_EVENT_NAME, {
        search_string: shopify.searchTerm,
      })
    );
  }
}

export function trackCustomerAddToCart(
  payload: any,
  sendToServer: (payload: any) => void
) {
  const {totalValue, addedProducts} = getAddedProducts(payload);

  sendToServer(
    customerEventSchema(payload, PRODUCT_ADDED_TO_CART_EVENT_NAME, {
      total_value: totalValue,
      products: formatProductsJSON(addedProducts),
      cart_token: stripId(payload.cart.id),
    })
  );
}

function customerEventSchema(
  payload: any,
  eventName: string,
  extraData?: any
): any {
  return {
    schema_id: 'custom_storefront_customer_tracking/1.0',
    payload: {
      ...buildCustomerPayload(payload, extraData),
      event_name: eventName,
    },
    metadata: {
      event_created_at_ms: Date.now(),
    },
  };
}

function buildCustomerPayload(payload: any, extraData: any = {}): any {
  const location = document.location;
  const shopify = payload.shopify;
  const [navigation_type, navigation_api] = getNavigationType();
  let formattedData = {
    source: 'hydrogen',
    shop_id: stripGId(shopify.shopId),
    hydrogenSubchannelId: shopify.storefrontId || '0',

    event_time: Date.now(),
    event_id: buildUUID(),
    unique_token: shopify.userId,

    referrer: document.referrer,
    event_source_url: location.href,

    user_agent: navigator.userAgent,
    navigation_type,
    navigation_api,

    currency: shopify.currency,

    /**
     * For now, all cookie consent management is manage by developers
     *
     * TO-DO: When we have access to consent api, implement is_persistent_cookie
     *        according to the definition below
     *
     * It references the state of consent for GDPR protected visitors.
     * If persistent === FALSE, it means that the merchant has set
     * “Partially collected before consent”,  and the visitor has not consented.
     * Until a user consents, we downgrade _shopify_y to a session cookie instead of 1yr expiry.
     * It denotes a partially stable identifier (stable only for the length of the session,
     * which should be until they close the browser).
     */
    is_persistent_cookie: true,
    ccpa_enforced: false,
    gdpr_enforced: false,
  };

  formattedData = addDataIf(
    {
      customer_id: shopify.isLoggedIn && stripGId(customerId),
    },
    formattedData
  );

  formattedData = addDataIf(extraData, formattedData);

  return formattedData;
}

function formatProductsJSON(products: any[]) {
  if (!products || products.length === 0) {
    throw Error(
      `Make sure useServerAnalytics returns "products"\n More details at ${DOC_URL}#product\n`
    );
  }

  const formattedProducts = products.map((p) => {
    validateProductData(p, 'useServerAnalytics', 'column', 'product-page');

    return JSON.stringify({
      ...p,
      product_id: stripGId(p.product_gid),
      variant_id: stripGId(p.variant_gid),
      quantity: Number(p.quantity || 0),
    });
  });
  return formattedProducts;
}

function getAddedProducts(payload: any) {
  const addedLines = payload.addedCartLines as CartLineInput[];
  const cartLines = formatCartLinesByProductVariant(payload.cart.lines);
  let totalValue = 0;

  const addedProducts = addedLines.map((line) => {
    const item = cartLines[line.merchandiseId];
    totalValue += parseFloat(item.price) * (line.quantity || 0);
    return {
      ...item,
      quantity: line.quantity,
    };
  });

  return {
    totalValue,
    addedProducts,
  };
}

function formatCartLinesByProductVariant(lines: any) {
  const cartLines = flattenConnection(lines) as CartLine[];
  const cartItems: Record<string, any> = {};

  cartLines.forEach((line) => {
    const product = line.merchandise.product;
    const variant = line.merchandise;

    cartItems[line.merchandise.id] = {
      product_gid: product.id,
      variant_gid: variant.id,
      name: product.title,
      variant: variant.title,
      brand: product.vendor,
      category: product.productType,
      price: variant.priceV2.amount,
      sku: variant.sku,
    };

    validateProductData(
      cartItems[line.merchandise.id],
      'cart fragment',
      'gqlField',
      'cart-fragment'
    );
  });

  return cartItems;
}

function validateProductData(
  product: any,
  source: string,
  requireKey: string,
  docAnchor: string
) {
  requiredProductFields.forEach((field) => {
    if (!product[field.column] || product[field.column] === '') {
      throw Error(
        `Make sure ${source} returns "${field[requireKey]}"\n More details at ${DOC_URL}#${docAnchor}\n`
      );
    }
  });
}

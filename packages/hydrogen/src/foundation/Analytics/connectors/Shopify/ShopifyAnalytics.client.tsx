import {useEffect} from 'react';
import {parse, stringify} from 'worktop/cookie';
import {ClientAnalytics} from '../../index';
import {buildUUID, addDataIf} from './utils';
import {SHOPIFY_S, SHOPIFY_Y} from './const';

const longTermLength = 60 * 60 * 24 * 360 * 2; // ~2 year expiry
const shortTermLength = 60 * 30; // 30 mins
const myShopifyDomain = 'myshopify.com';
// const oxygenDomain = 'myshopify.dev';

let isInit = false;
let microSessionCount = 0;

export function ShopifyAnalyticsClient({cookieDomain}: {cookieDomain: string}) {
  useEffect(() => {
    try {
      // Find Shopify cookies
      const cookieData = parse(document.cookie);
      const shopifyYCookie = cookieData[SHOPIFY_Y] || buildUUID();
      const shopifySCookie = cookieData[SHOPIFY_S] || buildUUID();

      /**
       * Set user and session cookies and refresh the expiry time
       */
      updateCookie(SHOPIFY_Y, shopifyYCookie, longTermLength, cookieDomain);
      updateCookie(SHOPIFY_S, shopifySCookie, shortTermLength, cookieDomain);

      ClientAnalytics.pushToPageAnalyticsData({
        shopify: {
          pageId: buildUUID(),
          userId: shopifyYCookie,
          sessionId: shopifySCookie,
        },
      });

      microSessionCount = 0;

      // TODO: Fix with useEvent when ready
      // RFC: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
      if (!isInit) {
        isInit = true;

        const eventNames = ClientAnalytics.eventNames;

        ClientAnalytics.subscribe(eventNames.PAGE_VIEW, trackPageView);
        ClientAnalytics.subscribe(eventNames.ADD_TO_CART, (payload: any) => {
          microSessionCount += 1;
          try {
            sendToServer(storefrontAddToCartSchema(payload));
          } catch (error) {
            console.error(
              `Error Shopify analytics: ${ClientAnalytics.eventNames.ADD_TO_CART}`,
              error
            );
          }
        });

        // On a slow network, the pageview event could be already fired before
        // we subscribed to the pageview event
        if (ClientAnalytics.hasSentFirstPageView()) {
          trackPageView(ClientAnalytics.getPageAnalyticsData());
        }
      }
    } catch (err) {
      // Do nothing
    }
  });

  return null;
}

function updateCookie(
  cookieName: string,
  value: string,
  maxage: number,
  cookieDomain: string
) {
  const cookieString = stringify(cookieName, value, {
    maxage,
    domain: getCookieDomain(cookieDomain),
    secure: process.env.NODE_ENV === 'production',
    samesite: 'Lax',
    path: '/',
  });

  document.cookie = cookieString;
  return cookieString;
}

function getCookieDomain(cookieDomain: string): string {
  const hostname = location.hostname;

  if (hostname.indexOf(myShopifyDomain) !== -1) {
    return `.${hostname.split('.').slice(-3).join('.')}`;
  } else if (hostname.indexOf(cookieDomain) !== -1) {
    return `.${cookieDomain}`;
  } else {
    return '';
  }
}

function trackPageView(payload: any): void {
  microSessionCount += 1;
  try {
    sendToServer(storefrontPageViewSchema(payload));
  } catch (error) {
    console.error(
      `Error Shopify analytics: ${ClientAnalytics.eventNames.PAGE_VIEW}`,
      error
    );
  }
}

function storefrontPageViewSchema(payload: any): any {
  return [
    {
      schema_id: 'trekkie_storefront_page_view/1.2',
      payload: buildStorefrontPageViewPayload(payload),
      metadata: {
        event_created_at_ms: Date.now(),
      },
    },
  ];
}

function buildBasePayload(payload: any): any {
  const shopify = payload.shopify;
  let formattedData = {
    appClientId: 6167201,
    hydrogenSubchannelId: shopify.storefrontId,

    uniqToken: shopify.userId,
    visitToken: shopify.sessionId,
    microSessionId: shopify.pageId,
    microSessionCount,

    referrer: document.referrer,

    shopId: stripGId(shopify.shopId),
    currency: shopify.currency,
    contentLanguage: shopify.acceptedLanguage,
  };

  formattedData = addDataIf(
    {
      isMerchantRequest: isMerchantRequest(),
    },
    formattedData
  );

  formattedData = addDataIf(
    {
      pageType: shopify.pageType,
    },
    formattedData
  );

  if (shopify.resourceId) {
    try {
      formattedData = addDataIf(
        {
          resourceType: getResourceType(shopify.resourceId),
          resourceId: stripGId(shopify.resourceId),
        },
        formattedData
      );
    } catch (err) {
      // do nothing
    }
  }

  return formattedData;
}

function buildStorefrontPageViewPayload(payload: any): any {
  const location = document.location;
  const shopify = payload.shopify;
  let formattedData = {
    ...buildBasePayload(payload),

    isPersistentCookie: shopify.isPersistentCookie,

    url: location.href,
    path: location.pathname,
    search: location.search,
    title: document.title,
  };

  formattedData = addDataIf(
    {
      customerId: shopify.customerId,
    },
    formattedData
  );

  return formattedData;
}

function storefrontAddToCartSchema(payload: any): any[] {
  const addToCartPayloads: any[] = [];
  const cartItems = flattenProductLines(payload.cart.lines.edges);
  const basePayload = buildBasePayload(payload);

  payload.addedCartLines.forEach((product: any) => {
    addToCartPayloads.push({
      schema_id: 'trekkie_storefront_track_added_product/1.1',
      payload: {
        ...basePayload,
        ...buildStorefrontAddToCartPayload(
          cartItems[product.merchandiseId || product.id]
        ),
        quantity: `${product.quantity}`,
      },
      metadata: {
        event_created_at_ms: Date.now(),
      },
    });
  });

  return addToCartPayloads;
}

function buildStorefrontAddToCartPayload(variant: any): any {
  let formattedData = {
    productId: stripGId(variant.product.id),
    name: variant.product.title,

    variantId: `${stripGId(variant.id)}`,
    variant: variant.title,

    price: parseInt(variant.priceV2.amount),
  };

  formattedData = addDataIf(
    {
      sku: variant.sku,
    },
    formattedData
  );

  formattedData = addDataIf(
    {
      category: variant.product.productType,
    },
    formattedData
  );

  formattedData = addDataIf(
    {
      brand: variant.product.vendor,
    },
    formattedData
  );

  return formattedData;
}

function flattenProductLines(lines: any): Record<string, any> {
  const products: Record<string, any> = {};
  lines.forEach((line: any) => {
    const product: any = line.node.merchandise;
    products[product.id] = product;
  });
  return products;
}

function isMerchantRequest(): Boolean {
  // const hostname = location.hostname;
  // if (hostname.indexOf(oxygenDomain) !== -1 || hostname === 'localhost') {
  //   return true;
  // }
  return false;
}

function stripGId(text?: string): number | undefined {
  return text ? parseInt(text.substring(text.lastIndexOf('/') + 1)) : undefined;
}

function getResourceType(text: string): string {
  return text
    .substring(0, text.lastIndexOf('/'))
    .replace(/.*shopify\//, '')
    .toLowerCase();
}

const BATCH_SENT_TIMEOUT = 500;
let batchedData: any[] = [];
let batchedTimeout: NodeJS.Timeout | null;

function sendToServer(events: any[]) {
  batchedData = batchedData.concat(events);

  if (batchedTimeout) {
    clearTimeout(batchedTimeout);
    batchedTimeout = null;
  }

  batchedTimeout = setTimeout(() => {
    const batchedDataToBeSent = {
      events: batchedData,
      metadata: {
        event_sent_at_ms: Date.now(),
      },
    };

    batchedData = [];
    batchedTimeout = null;

    // Send to server
    try {
      // fetch('/__event?shopify', {
      //   method: 'post',
      //   headers: {
      //     'cache-control': 'no-cache',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(batchedDataToBeSent),
      // });
      fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
        method: 'post',
        headers: {
          'content-type': 'text/plain',
        },
        body: JSON.stringify(batchedDataToBeSent),
      });
    } catch (error) {
      // Fallback to client-side
      fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
        method: 'post',
        headers: {
          'content-type': 'text/plain',
        },
        body: JSON.stringify(batchedDataToBeSent),
      });
    }
  }, BATCH_SENT_TIMEOUT);
}

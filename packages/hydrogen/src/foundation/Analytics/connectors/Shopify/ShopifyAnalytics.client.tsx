import {useEffect} from 'react';
import {stringify} from 'worktop/cookie';
import {Cookie} from '../../../Cookie/Cookie';
import {ClientAnalytics} from '../../index';
// import {
//   formatProductsData,
//   formatCartProductsData,
//   flattenCartLines,
//   formatProductData,
// } from './cart-utils';
// import {getClientId} from './UniqueIdManager.client';
import {buildUUID, addDataIf} from './utils';
import {SESSION_COOKIE, USER_COOKIE} from './const';

const longTermLength = 60 * 60 * 24 * 360 * 2; // ~2 year expiry
const shortTermLength = 60 * 30; // 30 mins
const myShopifyDomain = 'myshopify.com';
const oxygenDomain = 'shopify-oxygen-platform.workers.dev/';

let isInit = false;
let microSessionCount = 0;

export function ShopifyAnalyticsClient({cookieName}: {cookieName: string}) {
  useEffect(() => {
    // Find our session cookie
    const sessionCookie = new Cookie(cookieName);
    const cookieData = sessionCookie.parse(document.cookie);

    /**
     * Set user and session cookies and refresh the expiry time
     *
     * Hydrogen page navigation done by a fetch API. However, multiple set-cookie
     * headers or a single set-cookie header with multiple cookies does not work
     * with fetch API.
     *
     * We are storing all cookie values inside a single cookie and restore it on
     * the client side with the expected expiry
     */
    updateCookie(USER_COOKIE, cookieData[USER_COOKIE], longTermLength);
    updateCookie(SESSION_COOKIE, cookieData[SESSION_COOKIE], shortTermLength);

    ClientAnalytics.pushToPageAnalyticsData(
      {
        pageId: buildUUID(),
        userId: cookieData[USER_COOKIE],
        sessionId: cookieData[SESSION_COOKIE],
        acceptedLanguage: cookieData['acceptedLanguage'],
      },
      'shopify'
    );

    microSessionCount = 0;

    // TODO: Fix with useEvent when ready
    // RFC: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
    if (!isInit) {
      isInit = true;

      const eventNames = ClientAnalytics.eventNames;

      ClientAnalytics.subscribe(eventNames.PAGE_VIEW, trackPageView);

      // On a slow network, the pageview event could be already fired before
      // we subscribed to the pageview event
      if (ClientAnalytics.hasSentPageView) {
        trackPageView(ClientAnalytics.getPageAnalyticsData());
      }

      // ClientAnalytics.subscribe(eventNames.VIEWED_PRODUCT, (payload) => {
      //   try {
      //     sendToServer(
      //       wrapWithSchema({
      //         event_name: 'page_rendered',
      //         event_type: 'viewed_product',
      //         ...buildBasePayload(payload),
      //         products: formatProductsData(payload.products),
      //       })
      //     );
      //   } catch (error) {
      //     console.error(
      //       `Error Shopify analytics: ${eventNames.UPDATE_CART}`,
      //       error
      //     );
      //   }
      // });

      // ClientAnalytics.subscribe(eventNames.ADD_TO_CART, (payload) => {
      //   try {
      //     sendToServer(
      //       wrapWithSchema({
      //         event_name: 'cart',
      //         event_type: 'added_product',
      //         ...buildBasePayload(payload),
      //         products: formatCartProductsData(
      //           payload.addedCartLines,
      //           payload.cart
      //         ),
      //       })
      //     );
      //   } catch (error) {
      //     console.error(
      //       `Error Shopify analytics: ${eventNames.UPDATE_CART}`,
      //       error
      //     );
      //   }
      // });

      // ClientAnalytics.subscribe(eventNames.UPDATE_CART, (payload) => {
      //   try {
      //     const oldCartLines = flattenCartLines(payload.oldCart.lines);
      //     payload.updatedCartLines.forEach((line: any) => {
      //       if (line.quantity > oldCartLines[line.id].quantity) {
      //         sendToServer(
      //           wrapWithSchema({
      //             event_name: 'cart',
      //             event_type: 'added_product',
      //             ...buildBasePayload(payload),
      //             products: formatProductData([line], oldCartLines),
      //           })
      //         );
      //       }
      //     });
      //   } catch (error) {
      //     console.error(
      //       `Error Shopify analytics: ${eventNames.UPDATE_CART}`,
      //       error
      //     );
      //   }
      // });
    }
  });

  return null;
}

function updateCookie(cookieName: string, value: string, maxage: number) {
  const cookieString = stringify(cookieName, value, {
    maxage,
    domain: getCookieDomain(),
    samesite: 'Lax',
    path: '/',
  });

  document.cookie = cookieString;
  return cookieString;
}

function getCookieDomain(): string {
  const hostname = location.hostname;
  const hostnameParts = hostname.split('.');

  if (hostname === 'localhost') {
    return '';
  } else if (hostname.indexOf(myShopifyDomain) !== -1) {
    return `.${hostnameParts.slice(-3)}`;
  } else if (hostname.indexOf(oxygenDomain) !== -1) {
    return `.${hostnameParts.slice(-4)}`;
  }
  {
    return `.${hostnameParts.slice(-2)}`;
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
  return {
    schema_id: 'trekkie_storefront_page_view/1.2',
    payload: buildStorefrontPageViewPayload(payload),
    metadata: {
      event_created_at_ms: Date.now(),
    },
  };
}

function buildStorefrontPageViewPayload(payload: any): any {
  let formattedData = {
    isPersistentCookie: true,
    uniqToken: payload.shopify.userId,
    visitToken: payload.shopify.sessionId,
    microSessionId: payload.shopify.pageId,
    microSessionCount,

    url: document.location.href,
    path: document.location.pathname,
    search: document.location.search,
    referrer: document.referrer,
    title: document.title,

    api_client_id: '?',
    shop_id: payload.shopId,
    currency: payload.currency,
    contentLanguage: payload.shopify.acceptedLanguage,
    isMerchantRequest: isMerchantRequest(),
  };

  formattedData = addDataIf(
    {
      pageType: payload.pageType,
    },
    formattedData
  );

  formattedData = addDataIf(
    {
      resourceType: payload.resourceType,
      resourceId: payload.resourceId,
    },
    formattedData
  );

  formattedData = addDataIf(
    {
      customerId: payload.customerId,
    },
    formattedData
  );

  return formattedData;
}

function isMerchantRequest(): Boolean {
  const hostname = location.hostname;
  if (hostname.indexOf(oxygenDomain) !== -1 || hostname === 'localhost') {
    return true;
  }
  return false;
}

const BATCH_SENT_TIMEOUT = 500;
let batchedData: any[] = [];
let batchedTimeout: NodeJS.Timeout | null;

function sendToServer(data: any) {
  batchedData.push(data);

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
      fetch('/__event?shopify', {
        method: 'post',
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchedDataToBeSent),
      });
    } catch (error) {
      // Fallback to client-side
      // fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
      //   method: 'post',
      //   headers: {
      //     'content-type': 'text/plain',
      //   },
      //   body: JSON.stringify(batchedDataToBeSent),
      // });
    }
  }, BATCH_SENT_TIMEOUT);
}

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

const USER_COOKIE = '_shopify_y';
const SESSION_COOKIE = '_shopify_s';
const longTermLength = 60 * 60 * 24 * 360; // ~1 year expiry
const shortTermLength = 60 * 30; // 30 mins
const myShopifyDomain = 'myshopify.com';
const oxygenDomain = 'shopify-oxygen-platform.workers.dev/';

const APP = 'hydrogen';
let isInit = false;

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
        clientId: cookieData[USER_COOKIE],
        sessionId: cookieData[SESSION_COOKIE],
      },
      'shopify'
    );

    if (!isInit) {
      isInit = true;

      const eventNames = ClientAnalytics.eventNames;

      ClientAnalytics.subscribe(eventNames.PAGE_VIEW, (payload) => {
        try {
          sendToServer(
            wrapWithSchema({
              ...buildBasePayload(payload),
              event_name: 'page_rendered',
              event_type: 'page_view',
            })
          );
        } catch (error) {
          console.error(
            `Error Shopify analytics: ${eventNames.PAGE_VIEW}`,
            error
          );
        }
      });

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

  console.log(cookieString);
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

function wrapWithSchema(payload: any): any {
  return {
    schema_id: 'customer_event/2.0',
    payload,
    metadata: {
      event_created_at_ms: Date.now(),
    },
  };
}

function buildBasePayload(payload: any): any {
  let formattedData = {
    shop_id: payload.shopId,
    event_id: buildUUID(),
    event_time: Date.now(),
    event_source: APP,
    api_client_id: '?', // TBD
    channel: APP,
    // sub_channel: // storefront id - from env

    currency: payload.currency,
    page_id: payload.shopify.pageId,
    page_url: document.location.href,
    normalized_page_url: `${document.location.origin}${document.location.pathname}`,
    query_params: document.location.search,
    canonical_page_url: payload.canonicalPageUrl,
    // search_string
    referrer: document.referrer,

    client_id: payload.shopify.clientId,
    client_id_type: 'shopify_y',
    // 'is_persistent_cookie': 'figure out how to determine this', // tbd
  };

  formattedData = addDataIf(
    {
      collection_name: payload.collectionName,
      collection_id: payload.collectionId,
    },
    formattedData
  );

  if (payload.utm) {
    formattedData = addDataIf(
      {
        utm_source: payload.utm.source,
        utm_campaign: payload.utm.campaign,
        utm_medium: payload.utm.medium,
        utm_content: payload.utm.content,
        utm_term: payload.utm.term,
      },
      formattedData
    );
  }

  return formattedData;
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
      fetch('/__event?Shopify', {
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

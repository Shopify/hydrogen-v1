import {useEffect} from 'react';
import {stringify} from 'worktop/cookie';
import {Cookie} from '../../../Cookie/Cookie';
import {ClientAnalytics} from '../../index';
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

    ClientAnalytics.pushToPageAnalyticsData({
      shopify: {
        pageId: buildUUID(),
        userId: cookieData[USER_COOKIE],
        sessionId: cookieData[SESSION_COOKIE],
        storefrontId: cookieData['storefrontId'],
        acceptedLanguage: cookieData['acceptedLanguage'],
      },
    });

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
    }
  });

  return null;
}

function updateCookie(cookieName: string, value: string, maxage: number) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieString = stringify(cookieName, value, {
    maxage,
    domain: getCookieDomain(),
    secure: isProd,
    httponly: isProd,
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
    return `.${hostnameParts.slice(-3).join('.')}`;
  } else if (hostname.indexOf(oxygenDomain) !== -1) {
    return `.${hostnameParts.slice(-4).join('.')}`;
  }
  {
    return `.${hostnameParts.slice(-2).join('.')}`;
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
  const location = document.location;
  const shopify = payload.shopify;
  let formattedData = {
    appId: 6167201,
    channel: 'hydrogen',
    subchannel: shopify.storefrontId,

    isPersistentCookie: true,
    uniqToken: shopify.userId,
    visitToken: shopify.sessionId,
    microSessionId: shopify.pageId,
    microSessionCount,

    url: location.href,
    path: location.pathname,
    search: location.search,
    referrer: document.referrer,
    title: document.title,

    shopId: stripGId(shopify.shopId),
    currency: shopify.currency,
    contentLanguage: shopify.acceptedLanguage,
    isMerchantRequest: false, //isMerchantRequest(),
  };

  formattedData = addDataIf(
    {
      pageType: shopify.pageType,
    },
    formattedData
  );

  if (shopify.resourceType && shopify.resourceId) {
    formattedData = addDataIf(
      {
        resourceType: shopify.resourceType,
        resourceId: stripGId(shopify.resourceId),
      },
      formattedData
    );
  }

  formattedData = addDataIf(
    {
      customerId: shopify.customerId,
    },
    formattedData
  );

  return formattedData;
}

// function isMerchantRequest(): Boolean {
//   const hostname = location.hostname;
//   if (hostname.indexOf(oxygenDomain) !== -1 || hostname === 'localhost') {
//     return true;
//   }
//   return false;
// }

function stripGId(text: string): number {
  return parseInt(text.substring(text.lastIndexOf('/') + 1));
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

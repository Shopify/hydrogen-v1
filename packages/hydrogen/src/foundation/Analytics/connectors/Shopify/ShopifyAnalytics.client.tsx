import {useEffect} from 'react';
import {parse, stringify} from 'worktop/cookie';
import {SHOPIFY_Y, SHOPIFY_S} from '../../../../constants.js';
import {ClientAnalytics} from '../../ClientAnalytics.js';
import {
  trackCustomerAddToCart,
  trackCustomerPageView,
} from './customer-events.client.js';
import {buildUUID, addDataIf, stripGId} from './utils.js';

const longTermLength = 60 * 60 * 24 * 360 * 2; // ~2 year expiry
const shortTermLength = 60 * 30; // 30 mins
const myShopifyDomain = 'myshopify.com';
const oxygenDomain = 'myshopify.dev';

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
        ClientAnalytics.subscribe(eventNames.ADD_TO_CART, trackAddToCart);

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
    secure: import.meta.env.PROD,
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
    if (payload && payload.shopify) {
      sendToServer(storefrontPageViewSchema(payload));
      trackCustomerPageView(payload, sendToServer);
    }
  } catch (error) {
    console.error(
      `Error Shopify analytics: ${ClientAnalytics.eventNames.PAGE_VIEW}\n`,
      error
    );
  }
}

function storefrontPageViewSchema(payload: any): any {
  return {
    schema_id: 'trekkie_storefront_page_view/1.4',
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
    appClientId: '6167201',
    hydrogenSubchannelId: shopify.storefrontId || '0',

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
  };

  formattedData = addDataIf(
    {
      isMerchantRequest: isMerchantRequest(),
      pageType: shopify.pageType,
      customerId: shopify.customerId,
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

function trackAddToCart(payload: any): void {
  microSessionCount += 1;

  try {
    if (payload && payload.shopify) {
      trackCustomerAddToCart(payload, sendToServer);
    }
  } catch (error) {
    console.error(
      `Error Shopify analytics: ${ClientAnalytics.eventNames.ADD_TO_CART}\n`,
      error
    );
  }
}

function isMerchantRequest(): Boolean {
  const hostname = location.hostname;
  if (hostname.indexOf(oxygenDomain) !== -1 || hostname === 'localhost') {
    return true;
  }
  return false;
}

function getResourceType(text = ''): string {
  return text
    .substring(0, text.lastIndexOf('/'))
    .replace(/.*shopify\//, '')
    .toLowerCase();
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

    // Send to Shopify
    try {
      fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
        method: 'post',
        headers: {
          'content-type': 'text/plain',
        },
        body: JSON.stringify(batchedDataToBeSent),
      });
    } catch (error) {
      // Do nothing
    }
  }, BATCH_SENT_TIMEOUT);
}

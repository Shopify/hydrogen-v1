import {useEffect} from 'react';
import {ClientAnalytics} from '../../index';
import {
  formatProductsData,
  formatCartProductsData,
  flattenCartLines,
  formatProductData,
} from './cart-utils';
import {getClientId} from './UniqueIdManager.client';
import {buildUUID, addDataIf} from './utils';

const APP = 'hydrogen';
let isInit = false;

export function ShopifyAnalytics() {
  useEffect(() => {
    ClientAnalytics.pushToPageAnalyticData(
      {
        pageId: buildUUID(),
        clientId: getClientId(),
      },
      'shopify'
    );

    if (!isInit) {
      isInit = true;
      const eventNames = ClientAnalytics.eventNames;

      ClientAnalytics.subscribe(eventNames.PAGE_VIEW, (payload) => {
        sendToServer(
          wrapWithSchema({
            ...buildBasePayload(payload),
            event_name: 'page_rendered',
            event_type: 'page_view',
          })
        );
      });

      ClientAnalytics.subscribe(eventNames.VIEWED_PRODUCT, (payload) => {
        sendToServer(
          wrapWithSchema({
            event_name: 'page_rendered',
            event_type: 'viewed_product',
            ...buildBasePayload(payload),
            products: formatProductsData(payload.products),
          })
        );
      });

      ClientAnalytics.subscribe(eventNames.ADD_TO_CART, (payload) => {
        sendToServer(
          wrapWithSchema({
            event_name: 'cart',
            event_type: 'added_product',
            ...buildBasePayload(payload),
            products: formatCartProductsData(
              payload.addedCartLines,
              payload.cart
            ),
          })
        );
      });

      ClientAnalytics.subscribe(eventNames.UPDATE_CART, (payload) => {
        try {
          const oldCartLines = flattenCartLines(payload.oldCart.lines);
          payload.updatedCartLines.forEach((line: any) => {
            if (line.quantity > oldCartLines[line.id].quantity) {
              sendToServer(
                wrapWithSchema({
                  event_name: 'cart',
                  event_type: 'added_product',
                  ...buildBasePayload(payload),
                  products: formatProductData([line], oldCartLines),
                })
              );
            }
          });
        } catch (error) {
          console.warn(
            `Error Shopify analytics: ${eventNames.UPDATE_CART}`,
            error
          );
        }
      });
    }
  });

  return null;
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

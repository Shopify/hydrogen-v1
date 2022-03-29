import {useEffect} from 'react';
import {ClientAnalytics} from '../../index';
import {stripGId} from '../../utils';
import {getClientId} from './UniqueIdManager.client';
import {buildUUID} from './utils';

const APP = 'hydrogen';
let isInit = false;

export function ShopifyAnalytics() {
  useEffect(() => {
    ClientAnalytics.resetPageAnalyticData();
    ClientAnalytics.pushToPageAnalyticData(
      {
        pageId: buildUUID(),
        clientId: getClientId(),
      },
      'shopify'
    );

    if (!isInit) {
      isInit = true;

      ClientAnalytics.subscribe('page-view', (payload) => {
        sendToMonorail(
          wrapWithMonorailSchema({
            ...buildBasePayload(payload),
            event_name: 'page_rendered',
            event_type: 'page_view',
          })
        );
      });

      ClientAnalytics.subscribe('viewed-product', (payload) => {
        sendToMonorail(
          wrapWithMonorailSchema({
            event_name: 'page_rendered',
            event_type: 'viewed_product',
            ...buildBasePayload(payload),
            products: formatProductsData(payload.products),
          })
        );
      });

      ClientAnalytics.subscribe('add-to-cart', (payload) => {
        console.log('add to cart', payload);
        sendToMonorail(
          wrapWithMonorailSchema({
            event_name: 'cart',
            event_type: 'added_product',
            ...buildBasePayload(payload),
            products: formatCartProductsData(
              payload.addedCartLines,
              payload.cart,
              payload.products[0]
            ),
          })
        );
      });
    }
  }, [isInit]);

  return null;
}

function formatCartProductsData(
  addedProducts: any[],
  cart: any,
  pageProduct: any
): any[] {
  let products: any[] = [];
  const cartItems = flattenCartLines(cart.lines.edges);
  addedProducts.forEach((product) => {
    const variant = cartItems[product.merchandiseId];
    products.push({
      product_gid: pageProduct.product_gid,
      name: variant.product.title,
      brand: pageProduct.brand,
      variant_gid: variant.id,
      variant: variant.title,
      quantity: product.quantity,
      price: variant.priceV2.amount,
      currency: variant.priceV2.currencyCode,
    });
  });
  return products;
}

function flattenCartLines(lines: any): Record<string, any> {
  const products: Record<string, any> = {};
  lines.forEach((line: any) => {
    const product: any = line.node.merchandise;
    products[product.id] = product;
  });
  return products;
}

function formatProductsData(products: any): any {
  products.forEach((product: any) => {
    product.id = stripGId(product.product_gid);
    product.variant_id = stripGId(product.variant_gid);
  });
  return products;
}

function wrapWithMonorailSchema(payload: any): any {
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

    // 'api_client_id': '?',
    channel: APP,
    sub_channel: payload.shopName,

    currency: payload.currency,
    page_id: payload.shopify.pageId,
    page_url: document.location.href,
    normalized_page_url: `${document.location.origin}${document.location.pathname}`,
    query_params: document.location.search,
    // 'canonical_page_url': '',
    referrer: document.referrer,

    client_id: payload.shopify.clientId,
    client_id_type: 'shopify_y',
    // 'is_persistent_cookie': 'figure out how to determine this', // tbd

    event_id: buildUUID(),
    event_time: Date.now(),
    event_source: APP,

    // 'regulations_enforced': 'tbd - do we have ip => geo with regualtion mapping available on oxygen/cloudflare?',
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

function addDataIf(
  keyValuePair: Record<string, string>,
  formattedData: any
): any {
  Object.entries(keyValuePair).forEach(([key, value]) => {
    if (value) {
      formattedData[key] = value;
    }
  });
  return formattedData;
}

const BATCH_SENT_TIMEOUT = 500;
let batchedData: any[] = [];
let batchedTimeout: NodeJS.Timeout | null;

function sendToMonorail(data: any) {
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

    console.log('monorail timeout', batchedDataToBeSent);

    // Publish to server
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
      console.log(error);
    }
  }, BATCH_SENT_TIMEOUT);
}

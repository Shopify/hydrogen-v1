export function request(
  request: Request,
  data?: any,
  contentType?: string
): void {
  const url = new URL(request.url);
  if (url.search === '?Shopify' && contentType === 'json') {
    data.events.forEach((event: any) => {
      event.payload.client_ip_address = request.headers.get('x-forwarded-for');
      event.payload.client_user_agent = request.headers.get('user-agent');
      console.log(event.payload);
    });
    console.log(data);

    fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
      method: 'post',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'text/plain',
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      // send to bugsnag? oxygen?
    });
  }
}

// ### Shop
// shop_id

// ### Event
// event_id - generated UUID
// event_time - timestamp now
// event_name - 'page_rendered'
// event_type - 'page_view'
// event_source - 'hydrogen'

// ### app
// api_client_id - ?
// channel - 'Custom Storefront'
// sub_channel - 'Hydrogen'

// ### page
// currency
// page_id - generated UUID (persist for per page)
// page_url - document.location
// normalized_page_url - document.location without query params
// query_params
// search_string
// canonical_page_url
// referrer
// session_id

// client_id - generated UUID (persist for per buyer)
// client_id_type - 'shopify_y'
// is_persistent_cookie - boolean
// client_ip_address
// client_user_agent

// ### Click
// click_id - ?
// click_id_type -?

// ### Customer
// customer_id
// email
// email_id
// email_sha256
// customer_email_address_id
// phone
// phone_sha256
// first_name
// last_name
// billing_address_address_1
// billing_address_address_2
// billing_address_city
// billing_address_region
// billing_address_country
// billing_address_zipcode

// ### UTM
// utm_source
// utm_campaign
// utm_medium
// utm_content
// utm_term

// ### marketing
// marketing_activity_id
// marketing_event_id

// ### order
// order_id
// order_value
// checkout_token

// ### add to cart
// cart_id
// products: [
//     variant_id: int, optional
//     product_id: int, optional
//     product_gid: string,
//     name: string,
//     price: float,
//     sku: string, optional
//     brand: string,
//     variant: string,
//     collection_name: string, optional
//     collection_id: float, optional
//     quantity: int
//     currency: string
// ]
// collection_name
// collection_id

// regulations_enforced

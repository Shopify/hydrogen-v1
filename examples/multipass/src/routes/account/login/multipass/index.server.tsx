import {gql} from '@shopify/hydrogen';
import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';
import {Multipassify} from '~/lib/multipassify';

import type {
  CustomerInfoType,
  NotLoggedInResponseType,
  MultipassRequestBody,
  CustomerDataResponseType,
} from '~/types';

declare global {
  // eslint-disable-next-line no-var
  var Oxygen: {env: any; [key: string]: any};
}

const CUSTOMER_INFO_QUERY = gql`
  query CustomerInfo($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      acceptsMarketing
    }
  }
`;

/*
  Generates a multipass token for a given customer and return_to url.
  Handles POST `/account/login/multipass` requests.
  expects body: { return_to?: string, customer }
*/
export async function api(
  request: HydrogenRequest,
  {session, queryShop}: HydrogenApiRouteOptions
) {
  const origin = request.headers.get('Origin') || '';
  const isOptionsReq = request.method === 'OPTIONS';
  const isPostReq = request.method === 'POST';
  let customerAccessToken;
  let customer;

  try {
    // only POST and OPTIONS allowed
    if (!isOptionsReq && !isPostReq) {
      return handleMethodNotAllowed();
    }

    // handle OPTIONS preflight requests
    if (isOptionsReq) {
      return handleOptionsPreflight(origin);
    }

    // POST requests handler
    // Get the request body
    const body: MultipassRequestBody = await request.json();
    customer = body.customer;

    if (!session) {
      return NotLoggedInResponse({
        url: body?.return_to ?? null,
        error: 'MISSING_SESSION',
      });
    }

    const sessionData = await session.get();
    customerAccessToken = sessionData?.customerAccessToken;

    // customer wasn't passed, but we have a session token.
    if (!customer && customerAccessToken) {
      // Have a customerAccessToken, get the customer so we can find their email.
      const response: CustomerDataResponseType = await queryShop({
        query: CUSTOMER_INFO_QUERY,
        variables: {
          customerAccessToken,
        },
      });

      customer = response?.data?.customer ?? null;
    }

    // Did no receive a customer, and the attempt to get it
    // from the session failed. Fallback to non-multipass response
    if (!customer && !customerAccessToken) {
      return handleLoggedOutResponse({
        return_to: body?.return_to ?? null,
        // @ts-ignore
        checkoutDomain: Oxygen.env.SHOPIFY_CHECKOUT_DOMAIN,
      });
    }

    // Check if customer has the required fields to create a multipass token
    if (!customer?.email) {
      return NotLoggedInResponse({
        url: body?.return_to ?? null,
        error: 'MISSING_EMAIL',
      });
    }

    if (!customer?.return_to && !body?.return_to) {
      return NotLoggedInResponse({
        url: body?.return_to ?? null,
        error: 'MISSING_RETURN_TO_URL',
      });
    }

    try {
      // generate a multipass url and token
      const multipassify = new Multipassify(
        // @ts-ignore
        Oxygen.env.SHOPIFY_STORE_MULTIPASS_SECRET
      );

      const customerInfo: CustomerInfoType = {
        ...customer,
        created_at: new Date().toISOString(),
        return_to: customer?.return_to || body?.return_to || '',
        remote_ip: body.client_ip,
      };

      // Generating a token for customer
      const data = multipassify.generate(
        customerInfo,
        // @ts-ignore
        Oxygen.env.SHOPIFY_STORE_DOMAIN,
        request
      );

      if (!data?.url) {
        return NotLoggedInResponse({
          url: body?.return_to ?? null,
          error: 'FAILED_GENERATING_MULTIPASS',
        });
      }

      // success, return token, url
      return new Response(JSON.stringify({data: {...data, error: null}}), {
        status: 200,
        headers: getCorsHeaders(origin),
      });
    } catch (error) {
      let message = 'unknown error';
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = JSON.stringify(error);
      }

      return NotLoggedInResponse({
        url: body?.return_to ?? null,
        error: message,
      });
    }
  } catch (error) {
    let message = 'unknown error';
    if (error instanceof Error) {
      message = error.message;
      // eslint-disable-next-line no-console
      console.log('Multipass error:', error.message);
    } else {
      message = JSON.stringify(error);
    }

    return NotLoggedInResponse({
      url: null,
      error: message,
    });
  }
}

function handleMethodNotAllowed() {
  return new Response(
    JSON.stringify({
      data: null,
      error: 'Method not allowed.',
    }),
    {
      status: 405,
      headers: {'Content-Type': 'application/json', Allow: 'POST, OPTIONS'},
    }
  );
}

function handleOptionsPreflight(origin: string) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

interface LoggedOutResponseType {
  return_to: string | null;
  checkoutDomain: string | undefined;
}

// Force log out a user in the checkout, if they logged out in the site.
// This fixes the edge-case where a user logs in (app),
// goes to checkout (logged in), then goes back to the app,
// logs out via the app and finally goes back to the checkout
// and the user is still logged in the checkout.
async function handleLoggedOutResponse(options: LoggedOutResponseType) {
  const {return_to, checkoutDomain} = options;
  const isCheckoutReq = /\/[\w-]{32}$/g.test(return_to || '');

  if (!return_to || !isCheckoutReq) {
    return NotLoggedInResponse({
      url: null,
      error: 'MISSING_CUSTOMER_ACCESS_TOKEN',
    });
  }

  // Force logging off the user in the checkout
  const encodedCheckoutUrl = encodeURIComponent(return_to);

  // For example, checkoutDomain `checkout.hydrogen.shop` or `shop.example.com` or `{shop}.myshopify.com`.
  const logOutUrl = `https://${checkoutDomain}/account/logout?return_url=${encodedCheckoutUrl}&step=contact_information`;
  return new Response(JSON.stringify({data: {url: logOutUrl}, error: null}));
}

/*
  Helper response when errors occur.
*/
function NotLoggedInResponse(options: NotLoggedInResponseType) {
  interface ErrorsType {
    [key: string]: string;
  }

  const ERRORS: ErrorsType = {
    MISSING_SESSION: 'No session found.',
    MISSING_SESSION_AND_CUSTOMER: 'No session or customer found.',
    MISSING_CUSTOMER: 'Required `customer` was not provided.',
    MISSING_CUSTOMER_IN_SESSION:
      'Required `customer` was not found in session.',
    MISSING_EMAIL: 'Required customer `email` was not provided.',
    MISSING_RETURN_TO_URL:
      'Required customer `return_to` URL was not provided.',
    MISSING_CUSTOMER_ACCESS_TOKEN: 'No customerAccessToken found.',
    FAILED_GENERATING_MULTIPASS: 'Could not generate a multipass url.',
    FORCING_CHECKOUT_LOGOUT: 'Forcing checkout customer logout.',
  };

  const {url, error: errorKey} = options;
  console.log({url, errorKey});

  let error;
  if (!errorKey) {
    error = 'UNKNOWN_ERROR';
  } else {
    error = ERRORS[errorKey] ?? 'UNKNOWN_ERROR';
  }

  // Always return the original URL.
  return new Response(JSON.stringify({data: {url}, error}), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });
}

function getCorsHeaders(origin: string): {[key: string]: string} {
  // Only requests from these origins will pass pre-flight checks
  const allowedOrigin = [
    origin,
    // Add other domains that you'd like to allow to multipass from
  ].find((allowedHost) => origin.includes(allowedHost));

  return {
    'Access-Control-Allow-Origin': `${allowedOrigin}`,
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
  };
}

import {gql} from '@shopify/hydrogen';
import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';
import {Multipassify} from '../lib/multipassify';
import type {NotAuthResponseType, MultipassCustomerData} from '../types';

declare global {
  // eslint-disable-next-line no-var
  var Oxygen: {env: any; [key: string]: any};
}

// POST `/multipass` endpoint.
// TODO: add support for `remote_ip` for security purposes.
// expect body to include: { targetUrl: string }
export async function api(
  request: HydrogenRequest,
  {session, queryShop}: HydrogenApiRouteOptions
) {
  try {
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({
          data: null,
          error: 'Method not allowed.',
        }),
        {
          status: 405,
          headers: {'Content-Type': 'application/json', Allow: 'POST'},
        }
      );
    }

    const {targetUrl} = await request.json();

    if (!targetUrl) {
      return NotAuthResponse({
        url: null,
        error: 'MISSING_CHECKOUT_URL',
      });
    }

    if (!session) {
      return NotAuthResponse({
        url: targetUrl,
        error: 'MISSING_SESSION',
      });
    }

    const {customerAccessToken} = await session.get();

    if (!customerAccessToken) {
      return NotAuthResponse({
        url: targetUrl,
        error: 'MISSING_CUSTOMER_ACCESS_TOKEN',
      });
    }

    const {data, errors} = await queryShop({
      query: CUSTOMER_INFO_QUERY,
      variables: {customerAccessToken},
    });

    if (errors) {
      console.error(
        'FAILED_FETCHING_CUSTOMER',
        errors[0]?.message || errors[0]
      );
      return NotAuthResponse({
        url: targetUrl,
        error: `FAILED_FETCHING_CUSTOMER`,
      });
    }

    const {customer} = data as MultipassCustomerData;

    if (!customer) {
      return NotAuthResponse({
        url: targetUrl,
        error: `MISSING_CUSTOMER`,
      });
    }

    if (!customer?.email) {
      return NotAuthResponse({
        url: targetUrl,
        error: 'INVALID_CUSTOMER',
      });
    }

    try {
      // generate a multipass url and token
      const multipass = new Multipassify(
        Oxygen.env.SHOPIFY_STORE_MULTIPASS_SECRET
      );

      const customerInfo = {
        ...customer,
        created_at: new Date().toISOString(),
        return_to: targetUrl, // target url
      };

      const {url, token} = await multipass.generate(
        customerInfo,
        Oxygen.env.SHOPIFY_STORE_DOMAIN
      );

      if (!url) {
        return NotAuthResponse({
          url: targetUrl,
          error: 'FAILED_GENERATING_MULTIPASS',
        });
      }

      // success
      return new Response(
        JSON.stringify({data: {url, token, loggedIn: true, error: null}}),
        {status: 200}
      );
    } catch (error) {
      let message = 'unknown error';
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = JSON.stringify(error);
      }

      return NotAuthResponse({
        url: targetUrl ?? null,
        error: message,
      });
    }
  } catch (error) {
    let message = 'unknown error';
    if (error instanceof Error) {
      message = error.message;

      console.log('error.message:outter', error.message);
    } else {
      message = JSON.stringify(error);
    }

    return NotAuthResponse({
      url: null,
      error: message,
    });
  }
}

/*
  Helper response when errors occur.
*/
function NotAuthResponse(options: NotAuthResponseType) {
  interface ErrorsType {
    [key: string]: string;
  }

  const ERRORS: ErrorsType = {
    MISSING_CHECKOUT_URL: 'Required `targetUrl` url was not provided.',
    MISSING_SESSION: 'No `session` found.',
    MISSING_CUSTOMER_ACCESS_TOKEN: 'No `customerAccessToken` found.',
    FAILED_FETCHING_CUSTOMER:
      'The was a problem fetching the associated customer.',
    MISSING_CUSTOMER: 'No associated `customer` data found.',
    INVALID_CUSTOMER: 'The associated `customer` data is not valid .',
    FAILED_GENERATING_MULTIPASS: 'Could not generate a multipass url.',
  };

  const {url, error: errorKey} = options;
  let error;
  if (!errorKey) {
    error = 'UNKNOWN_ERROR';
  } else {
    error = ERRORS[errorKey] ?? 'UNKNOWN_ERROR';
  }

  const response = JSON.stringify({
    data: {
      url,
      loggedIn: false,
    },
    error,
  });

  // always return the original url
  return new Response(response, {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });
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

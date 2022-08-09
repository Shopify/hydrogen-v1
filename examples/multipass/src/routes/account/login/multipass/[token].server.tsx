import {
  gql,
  type HydrogenRequest,
  HydrogenApiRouteOptions,
} from '@shopify/hydrogen';

interface QueryError {
  message: string;
  code: string;
  field: string;
}

import {Multipassify} from '~/lib/multipassify';

/**
 *  Authenticate a multipass token request
 */
export async function api(
  request: HydrogenRequest,
  {session, params, queryShop}: HydrogenApiRouteOptions
) {
  // multipass token
  const passedToken = params.token;
  const isGetRequest = request.method === 'GET';

  if (!isGetRequest) {
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        Allow: 'GET',
      },
    });
  }

  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  // create a multipassify instance
  const multipassify = new Multipassify(
    Oxygen.env.SHOPIFY_STORE_MULTIPASS_SECRET
  );

  try {
    // extract customer from the multipass token
    const customer = multipassify.parseToken(passedToken);

    const return_to = customer?.return_to || '/account/login';

    // retrieve the customer token based on the multipass token
    const {data, errors} = await queryShop({
      query: CUSTOMER_ACCESS_TOKEN_FROM_TOKEN_MUTATION,
      variables: {
        multipassToken: passedToken,
      },
    });

    if (errors) {
      // handle query errors
      return new Response(JSON.stringify(errors), {
        status: 500,
      });
    }

    const {token, customerUserErrors} = data.result;

    if (customerUserErrors.length) {
      const messages = customerUserErrors
        .map((error: QueryError) => error.message)
        .join(', ');
      return new Response(messages, {
        status: 403,
      });
    }

    if (!token) {
      return new Response('Access token not found', {
        status: 403,
      });
    }

    const {customerAccessToken} = token;

    if (!customerAccessToken) {
      return ReturnToResponse(return_to);
    }

    // store the customer access token in the session
    await session.set('customerAccessToken', customerAccessToken);

    return ReturnToResponse(return_to);
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : JSON.stringify(error),
      {
        status: 500,
      }
    );
  }
}

function ReturnToResponse(return_to: string) {
  return new Response(null, {
    status: 302,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache',
      Location: return_to,
    },
  });
}

const CUSTOMER_ACCESS_TOKEN_FROM_TOKEN_MUTATION = gql`
  mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
    result: customerAccessTokenCreateWithMultipass(
      multipassToken: $multipassToken
    ) {
      token: customerAccessToken {
        customerAccessToken: accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

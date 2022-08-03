import type {MultipassResponse} from '../types';

/*
A utility function that generates an auth `url` and `token`
given a targetUrl. It performs a POST request to the /multipass api
which handles the multipass auth based on the customer session and passed url.

Usage example:
- Checkout's button `onClick` handler.
*/
export async function multipass(
  targetUrl: string,
  redirect = true
): Promise<void | MultipassResponse> {
  try {
    const response = await fetch(`/multipass`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({targetUrl}),
    });

    if (!response.ok) {
      throw new Error(
        `${response.status} /multipass response not ok. ${response.statusText}`
      );
    }

    // POST /multipass data
    const {data, error} = await response.json();

    if (error) {
      throw new Error(error);
    }

    if (!data?.url) {
      throw new Error('Missing multipass url');
    }

    // return the url and token
    if (!redirect) {
      return data;
    }

    // redirect to the multipass url
    window.location.href = data.url;
  } catch (error) {
    if (!redirect) {
      return {
        url: null,
        token: null,
        error: error.message,
      };
    }

    // fallback — go to the url as a guest
    window.location.href = targetUrl;
  }
}

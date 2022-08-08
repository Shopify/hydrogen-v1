/*
  A utility that makes a POST request to the local `/account/login/multipass` endpoint
  to retrieve a multipass `url` and `token` for a given url/customer combination.

  Usage example:
  - Checkout button `onClick` handler.
  - Login button `onClick` handler. (with email required at minimum)
  - Social login buttons `onClick` handler.
*/

// @see: https://developers.google.com/identity/gsi/web/guides/display-button#javascript

import type {MultipassResponse, MultipassOptions} from '~/types';

export async function multipass(
  options: MultipassOptions
): Promise<void | MultipassResponse> {
  const {redirect, customer, return_to} = options;

  try {
    // If we pass `return_to` we try to get the customer
    // from the session. If not, it will throw.
    const body = customer ? {customer} : {return_to};

    // Get the ip address of the client to pass to the multipass as remote_ip
    const ipfy = await fetch('https://api.ipify.org?format=json');
    const {ip} = await ipfy.json();

    // Generate multipass token POST `/account/login/multipass`
    const response = await fetch('/account/login/multipass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...body, client_ip: ip}),
    });

    if (!response.ok) {
      const message = `${response.status} /multipass response not ok. ${response.statusText}`;
      throw new Error(message);
    }

    // Extract multipass token and url
    const {data, error} = await response.json();

    if (error) {
      throw new Error(error);
    }

    if (!data?.url) {
      throw new Error('Missing multipass url');
    }

    // return the url and token
    if (!redirect) {
      console.log('✅ checking out via multipass manually');
      return data;
    }

    console.log('✅ checking out via multipass redirect');
    // redirect to the multipass url
    window.location.href = data.url;
    return data;
  } catch (error) {
    //@ts-ignore
    console.log('⚠️ bypassing multipass checkout', error.message);

    const message = error instanceof Error ? error.message : 'Unknown error';
    if (!redirect) {
      return {
        url: null,
        token: null,
        error: message,
      };
    }

    // fallback — go to the url as a guest
    if (customer?.return_to) {
      window.location.href = customer?.return_to;
    }

    if (return_to) {
      window.location.href = return_to;
    }

    return {
      url: null,
      token: null,
      error: message,
    };
  }
}

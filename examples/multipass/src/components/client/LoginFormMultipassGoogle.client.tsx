import React, {useRef, useEffect} from 'react';
import {useLoadScript} from '@shopify/hydrogen';
import jwtDecode from 'jwt-decode';
import {multipass} from '~/lib/multipass';

interface GoogleJwtCredentialsType {
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
  sub: string;
}

interface GoogleJwTResponseType {
  credential: string;
}

declare global {
  var google: {
    accounts: {
      id: {
        initialize: (options: any) => void;
        renderButton: (element: HTMLDivElement | null, options: any) => void;
      };
    };
  };
}

/*
  Google Sign in component.
  @see: https://developers.google.com/identity/gsi/web/guides/display-button
*/
export function LoginFormMultipassGoogle() {
  const init = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const status = useLoadScript('https://accounts.google.com/gsi/client');

  async function handleJwtResponse(response: GoogleJwTResponseType) {
    const account: GoogleJwtCredentialsType = jwtDecode(response.credential);

    // google jwt customer info
    const customer = {
      first_name: account.given_name,
      last_name: account.family_name,
      email: account.email,
      multipass_identifier: account.sub,
      return_to: '/account',
    };

    // authenticate google customer info via multipass
    await multipass({
      customer,
      redirect: true, // will redirect to
    });
  }

  useEffect(() => {
    if (status !== 'done') return;
    if (typeof window?.google === 'undefined' || init.current) return;

    init.current = true;

    google.accounts.id.initialize({
      client_id: import.meta.env.PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleJwtResponse,
    });

    // @see: https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration
    google.accounts.id.renderButton(
      buttonRef.current,
      {
        theme: 'outline',
        text: 'Login in with Google',
        size: 'large',
        type: 'standard',
        autoPrompt: false,
      } // customization attributes
    );
  }, [status]);

  return (
    <div style={{width: '220px', height: '44px', overflow: 'hidde'}}>
      <div ref={buttonRef}>Loading...</div>
    </div>
  );
}

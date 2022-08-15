import React from 'react';
import {Link} from '@shopify/hydrogen';
import {LoginFormMultipass} from '~/components/client';

export default function LoginMultipass() {
  return (
    <>
      <h1>Sign in with multipass</h1>
      <p>
        If a user exists with the entered email we log them in, otherwise we
        create an account and log them in.
      </p>
      <p>
        <b>
          Notice: In this form, this is NOT a good practice. This would allow
          any user to access another's user account by simply entering their
          email.
        </b>
      </p>
      <p>
        <b>
          This mechanism should not be exposed to the user. Instead it should be
          only be used as a middleware when another auth system has already
          validated the user attempting to access a given account.
        </b>
      </p>
      <LoginFormMultipass />
      <br />
      <Link to="/">Back home</Link>
    </>
  );
}

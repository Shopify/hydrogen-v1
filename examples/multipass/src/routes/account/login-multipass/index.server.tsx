import React from 'react';
import {Link} from '@shopify/hydrogen';
import {LoginFormMultipass} from '~/components/client';

export default function LoginMultipass() {
  return (
    <>
      <h1>Sign in with multipass</h1>
      <p>
        If a user exists with this email we log them in, otherwise we create an
        account and log them in.
      </p>
      <LoginFormMultipass />
      <br />
      <Link to="/">Back home</Link>
    </>
  );
}

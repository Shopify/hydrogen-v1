import React from 'react';
import {Link} from '@shopify/hydrogen';
import {LoginFormMultipassGoogle} from '~/components/client';

export default function LoginMultipassGoogle() {
  return (
    <>
      <h1>Sign in with multipass and Google sign in</h1>
      <p>
        If a user exists with this email we log them in, otherwise we create an
        account and log them in.
      </p>
      <LoginFormMultipassGoogle />
      <br />
      <Link to="/">Back home</Link>
    </>
  );
}

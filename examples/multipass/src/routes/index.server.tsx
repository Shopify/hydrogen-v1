import React, {Suspense} from 'react';
import {Link} from '@shopify/hydrogen';
import {useSession} from '@shopify/hydrogen';
import {Products} from '~/components/server/index.server';
import {Cart} from '~/components/client';

export default function Home() {
  const {customerAccessToken} = useSession();

  return (
    <div>
      <h1>Multipass Demo</h1>
      <br />
      {customerAccessToken ? (
        <Link to="/account">Account</Link>
      ) : (
        <div>
          <Link to="/account/login">Login</Link>
          <br />
          <Link to="/account/login-multipass">Login (multipass)</Link>
          <br />
          <Link to="/account/login-multipass-google">
            Login (multipass google)
          </Link>
        </div>
      )}
      <hr />
      <h3>Products</h3>
      <Suspense fallback={<div>Loading products...</div>}>
        <Products />
      </Suspense>
      <hr />
      <Suspense fallback={<div>Loading cart...</div>}>
        <Cart />
      </Suspense>
    </div>
  );
}

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
      <p>
        This repo demonstrates how to seamlessly integrate &nbsp;
        <a
          target="_blank"
          href="https://www.shopify.com/plus?shpxid=4b620f16-EA6D-46D2-8851-DB05208459BB"
        >
          Shopify Plus
        </a>
        &nbsp;
        <a target="_blank" href="https://shopify.dev/api/multipass">
          multipass
        </a>{' '}
        feature with Hydrogen's customer &nbsp;
        <a
          target="_blank"
          href="https://https://shopify.dev/custom-storefronts/hydrogen/sessions"
        >
          session
        </a>
        &nbsp; and checkout session.
      </p>

      <h4>With multipass you can:</h4>
      <ol>
        <li>
          Persist the customer state across the hydrogen and the checkout flows.
          eg — stay logged in / out
        </li>
        <li>
          Automatically log in or create new accounts based on a external site's
          user profile.
        </li>
        <li>
          Log in or create accounts by leveraging a third-party auth service
          such as&nbsp;
          <a
            target="_blank"
            href="https://developers.google.com/identity/gsi/web/guides/overview"
          >
            Google Sign in
          </a>
          .
        </li>
      </ol>
      <hr />
      <br />
      <h5>Menu</h5>
      {customerAccessToken ? (
        <Link to="/account">View account</Link>
      ) : (
        <div>
          <div>
            <Link to="/account/login">Login</Link> —{' '}
            <small>classic hydrogen login flow (email and password)</small>
          </div>
          <br />
          <div>
            <Link to="/account/login-multipass">Login (multipass)</Link> —{' '}
            <small>login via multipass (email only)</small>
          </div>
          <br />
          <div>
            <Link to="/account/login-multipass-google">
              Login (multipass google)
            </Link>{' '}
            — <small>login via multipass (Google profile)</small>
          </div>
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

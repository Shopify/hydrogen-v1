import {Suspense} from 'react';
import {TodoList} from '../components/TodoList.server';

export default function Home() {
  return (
    <div>
      <h1>Hello Todo List</h1>
      <p>
        This example demonstrates how to use Shopify's{' '}
        <a target="_blank" href="https://shopify.dev/api/admin-graphql">
          GraphQL
        </a>{' '}
        &{' '}
        <a target="_blank" href="https://shopify.dev/api/admin-rest">
          REST
        </a>{' '}
        Admin APIs with{' '}
        <a target="_blank" href="https://hydrogen.shopify.dev/">
          Hydrogen
        </a>
        .
      </p>
      <p>
        Each todo is persisted as a{' '}
        <a
          target="_blank"
          href="https://shopify.dev/api/admin-graphql/2022-04/objects/Shop#field-shop-metafield"
        >
          Shop object metafield
        </a>{' '}
        🤷🏼‍♂️.
      </p>
      <p>
        The app is fully rendered in{' '}
        <a
          target="_blank"
          href="https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components"
        >
          .server components
        </a>{' '}
        which means all this code never reaches the browser 🔥.
      </p>

      <i>
        Note — the Admin API uses a different{' '}
        <a target="_blank" href="https://shopify.dev/api/usage/rate-limits">
          rate-limiting
        </a>{' '}
        mechanism than the Storefront API.
      </i>
      <br />
      <br />
      <hr />
      <Suspense fallback="Loading todo list...">
        <TodoList />
      </Suspense>
    </div>
  );
}

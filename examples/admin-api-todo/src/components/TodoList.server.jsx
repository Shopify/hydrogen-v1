import {CacheNone, fetchSync, flattenConnection} from '@shopify/hydrogen';
import {TodoItem} from './TodoItem.server';
import {TodoCreate} from './TodoCreate.server';
import {SHOP_METAFIELDS_QUERY} from '../graphql/queries';

export function TodoList() {
  /*
    fetch todos/metafields synchronously from the admin API
    just for demonstration purposes - (Should be fetched via storefront API)
  */
  const {data, error = null} = fetchTodosSync();

  if (error) {
    return (
      <p style={{color: 'red'}}>
        There was a problem loading todo list. {error}
      </p>
    );
  }

  const metafields = data?.shop?.metafields
    ? flattenConnection(data.shop.metafields)
    : [];

  // empty list of todos
  if (!metafields?.length) {
    return (
      <div>
        <h4>You are excelling in life.</h4>
        <TodoCreate />
      </div>
    );
  }

  // have todos
  return (
    <div>
      {/* Render each todo */}
      {metafields.map((metafield, index) => {
        return (
          <TodoItem
            key={metafield.id}
            index={index + 1}
            metafield={metafield}
          />
        );
      })}

      {/* Add more todos */}
      <TodoCreate />
    </div>
  );
}

/*
  Fetch todos from the Admin API. Each todo is stored as a metafield in the Shop object
  Because this is a server component, we can query the API directly.
*/
function fetchTodosSync() {
  return fetchSync(
    `https://${Oxygen.env.SHOPIFY_ADMIN_API_DOMAIN}/admin/api/${Oxygen.env.SHOPIFY_ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': Oxygen.env.SHOPIFY_ADMIN_API_PRIVATE_TOKEN,
      },
      cache: CacheNone(),
      body: JSON.stringify({
        query: SHOP_METAFIELDS_QUERY,
        variables: {},
      }),
    }
  ).json();
}

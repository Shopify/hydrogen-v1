import {nanoid} from 'nanoid';
import {graphqlClient} from '../../utils/graphqlClient';
import {restClient} from '../../utils/restClient';
import {
  CREATE_METAFIELD_DEFINITION_MUTATION,
  DELETE_METAFIELD_MUTATION,
} from '../../graphql/mutations';

/**
 *  A demo Admin API endpoint that handles POST requests from form submission actions:
 *  - Create: Adds a new metafield definition and metafield for each todo
 *  - Update: Updates a metafield/todo
 *  - Delete: Deletes a metafield/todo
 */
export async function api(req) {
  try {
    const {origin} = new URL(req.url);
    const contentType = req.headers.get('content-type');
    let body = {};

    if (req.method !== 'POST') {
      // Redirect back to the origin
      return redirectToOrigin({origin});
    }

    // We only allow form-encoded POST requests
    if (!contentType.includes('form')) {
      return redirectToOrigin({origin});
    }

    // Capture the form data
    const formData = await req.formData();
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }

    // Capture the target action from the form input[name=action]
    const action = body.action;

    if (!action) {
      return new Response(null, {
        status: 400,
        body: 'form action not provided.',
      });
    }

    switch (action) {
      case 'createTodo':
        return await createTodo({...body, origin});

      case 'deleteTodo':
        return await deleteTodo({...body, origin});

      // Uses the REST Admin API for illustration purposes
      case 'updateTodo':
        return await updateTo({...body, origin});

      default:
        return new Response(null, {
          status: 405,
          body: `Invalid action provided "${action}"`,
        });
    }
  } catch (error) {
    console.log('api/todo:error', error);
    return new Response(error.message, {
      status: 200,
      headers: {Location: origin},
    });
  }
}

/*
  Creates a new metafield to store the todo value.
  If no metafield definition exists, then create one and add the metafield.
  If a metafield definition exists we just add the metafield to it
*/
async function createTodo({value, origin}) {
  const nextKey = `todo_${nanoid(6)}`;

  const {data: createData, error: createError} =
    await createMetafieldDefinition(nextKey);

  let definitionKey;

  if (createError) {
    // a metafield definition already exists for this key
    definitionKey = nextKey;
  } else {
    // created a new definition. let's use the key to store the metafield/todo
    definitionKey = createData.metafieldDefinitionCreate.createdDefinition.key;
  }

  // add the new metafield to the definition
  return updateTo({key: definitionKey, value, origin});
}

/*
    Create another metafield definition in the SHOp resource
    to store our metafield on
*/
async function createMetafieldDefinition(nextKey) {
  const variables = {
    definition: {
      name: 'todo',
      namespace: 'hydrogen',
      key: nextKey,
      ownerType: 'SHOP',
      type: 'multi_line_text_field',
    },
  };

  const response = await graphqlClient({
    query: CREATE_METAFIELD_DEFINITION_MUTATION,
    variables,
  });

  if (response?.data?.metafieldDefinitionCreate?.userErrors?.length) {
    // metafield definition already exists
    return {
      error: response.data.metafieldDefinitionCreate.userErrors[0].message,
      data: null,
    };
  }

  return response;
}

/*
  Update a metafield/todo based on a metafield.key
*/
async function updateTo({key, value, origin}) {
  // update metafield
  const body = {
    metafield: {
      namespace: 'hydrogen',
      key: key,
      value: value || '',
      type: 'multi_line_text_field',
    },
  };

  const {data, error} = await restClient({
    resource: 'metafields',
    body,
  });

  if (error) {
    return new Response(
      JSON.stringify({
        error,
      }),
      {status: 401}
    );
  }

  return redirectToOrigin({origin});
}

/*
  Deletes a metafield/todo via metafield.id.
  TODO: We should really delete the definition and all it's metafields instead.
*/
async function deleteTodo({id, origin}) {
  const variables = {
    input: {
      id: id,
    },
  };

  const {data, error} = await graphqlClient({
    query: DELETE_METAFIELD_MUTATION,
    variables,
  });

  if (error) {
    return new Response(
      JSON.stringify({
        error,
      }),
      {status: 401}
    );
  }

  return redirectToOrigin({origin});
}

/*
  Redirect to the origin
*/
function redirectToOrigin({origin}) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: origin,
    },
  });
}

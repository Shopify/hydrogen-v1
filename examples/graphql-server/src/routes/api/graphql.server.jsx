import {graphql, buildSchema} from 'graphql';

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var rootValue = {
  hello: () => {
    return 'Hello world!';
  },
};

export async function api(request) {
  const body = await request.json();
  const source = body.query;

  let response;

  try {
    response = await graphql({
      schema,
      source,
      rootValue,
    });
  } catch (error) {
    console.log(error);
  }

  const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
  };

  return new Response(JSON.stringify(response), {
    headers,
  });
}

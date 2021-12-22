export const comments = [
  {
    id: 0,
    value: 'some comment',
  },
];
let idCounter = 1;

export async function api(request) {
  switch (request.method) {
    case 'GET':
      return new Response(JSON.stringify(comments), {status: 200});
    case 'POST':
      comments.push(createNewComment(JSON.parse(request.body)));
      return new Response(JSON.stringify(comments[comments.length - 1]), {
        status: 200,
      });
    case 'DELETE':
      comments.length = 0;
      return new Response(null, {status: 200});
  }

  return new Response(null, {status: 404});
}

function createNewComment(body) {
  return {...JSON.parse(body), id: idCounter++};
}

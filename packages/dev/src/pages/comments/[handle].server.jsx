import {comments} from '../comments.server';

export async function api(request, {params: {handle}}) {
  const comment = comments.find((comment) => comment.id == handle);

  if (comment) {
    switch (request.method) {
      case 'GET':
        return new Response(JSON.stringify(comment), {
          status: 200,
        });
      case 'DELETE':
        comments.splice(
          comments.findIndex((c) => c === comment),
          1,
        );
        return new Response(null, {
          status: 200,
        });
    }
  }

  return new Response('Not found', {
    status: 404,
  });
}

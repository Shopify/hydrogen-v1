export async function api(request, {session}) {
  switch (request.method) {
    case 'DELETE':
      await session.destroy();
      return 'Session Destroyed';
    case 'GET':
      return await session.get();
    case 'POST': {
      const json = await request.json();
      await session.set('someData', json.someData);
      return 'Session Created';
    }
  }

  return new Response('Error', {
    status: 400,
  });
}

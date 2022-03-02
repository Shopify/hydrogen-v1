export default function Headers({response}) {
  response.writeHead({
    status: 201,
    statusText: 'hey',
    headers: {'Accept-Encoding': 'deflate'},
  });

  response.headers.set('Set-Cookie', 'hello=world');
  response.headers.append('Set-Cookie', 'hello2=world2');
  response.headers.append('Accept-Encoding', 'gzip');

  return (
    <div>
      <h1>Headers</h1>
    </div>
  );
}

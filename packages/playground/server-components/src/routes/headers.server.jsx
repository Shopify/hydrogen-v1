export default function Headers({response}) {
  response.status = 201;
  response.statusText = 'hey';
  response.headers.set('Accept-Encoding', 'deflate');
  response.headers.set('Set-Cookie', 'hello=world');
  response.headers.append('Set-Cookie', 'hello2=world2');
  response.headers.append('Accept-Encoding', 'gzip');

  return (
    <div>
      <h1>Headers</h1>
    </div>
  );
}

export default function CustomBody({response}) {
  response.doNotStream();
  response.headers.set('content-type', 'text/plain');
  return response.send('User-agent: *\nDisallow: /admin\n');
}

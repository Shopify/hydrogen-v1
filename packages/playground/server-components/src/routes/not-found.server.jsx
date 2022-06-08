export default function NotFound({response}) {
  response.doNotStream();
  response.notFound();
  return 'Not found';
}

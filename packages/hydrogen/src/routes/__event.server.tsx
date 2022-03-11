export function api({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  console.log('__event api', request);
  return response;
}

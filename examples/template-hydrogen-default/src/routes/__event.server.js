export default function api({request, response}) {
  console.log('__event api', request, response);
  return response.send();
}

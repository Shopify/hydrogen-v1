export async function api(request, {params: {handle}}) {
  return new Response('Status: ' + handle, {status: handle});
}
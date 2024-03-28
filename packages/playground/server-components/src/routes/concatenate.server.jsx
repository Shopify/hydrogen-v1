export async function api(request) {
  return new Request(new URL(request.url).origin + '/about', {
    headers: {
      'Hydrogen-Concatenate': 'true',
    },
  });
}

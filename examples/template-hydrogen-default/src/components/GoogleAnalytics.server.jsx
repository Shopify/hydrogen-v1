export function request(request, data) {
  console.log('GA Server-side');

  console.log(request.headers.get('user-agent'));
  console.log(request.headers.get('x-forwarded-for'));
  console.log(data);
}

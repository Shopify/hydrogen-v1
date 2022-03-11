export function api(request, {params}) {
  console.log('__event api', request, params);

  Promise.resolve(request.json()).then((data) => {
    console.log(data);
  });

  return new Response(null, {
    status: 200,
  });
}

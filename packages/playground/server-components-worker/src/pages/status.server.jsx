export async function api(request) {
    return new Response('OK', {
        status: 200,
        headers: {Allow: 'GET'},
    });
}

export async function api(request) {
    return new Response('No content', {
        status: 204,
        headers: {Allow: 'GET'},
    });
}

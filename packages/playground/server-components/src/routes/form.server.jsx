export async function api(request) {
  const formData = await request.formData();
  let resp = '';

  for (let entry of formData) {
    resp += entry.join('=');
  }
  return new Response(resp);
}

export default function () {
  return (
    <form action="/form" method="POST">
      <label htmlFor="fname">First name:</label>
      <input type="text" id="fname" name="fname"></input>
      <input id="fsubmit" type="submit" value="Submit"></input>
    </form>
  );
}

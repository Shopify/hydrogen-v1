export async function api(request) {
  const text = await request.text();
  return new Response(text);
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

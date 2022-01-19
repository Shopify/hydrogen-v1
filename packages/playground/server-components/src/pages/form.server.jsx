import Form from '../components/Form.client';

const names = [];

export async function api(request) {
  const formData = await request.formData();

  for (let entry of formData) {
    names.push(entry[1]);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: '/form',
    },
  });
}

export default function () {
  return (
    <Form action="/form" method="POST">
      <label htmlFor="fname">First name:</label>
      <input type="text" id="fname" name="fname" autoFocus></input>
      <input id="fsubmit" type="submit" value="Submit"></input>
      <ol>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ol>
    </Form>
  );
}

// Form component
// renders a vanilla form action method
// if JS is enabled, disables the form post, and instead fetch posts.
// Calls RSC hydrate on success

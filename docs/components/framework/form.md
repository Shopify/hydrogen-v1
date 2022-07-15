---
gid: 9120943b-00c9-4da3-a201-5a54cab6ca2a
title: Form
description: The Form provides a declarative way to perform mutations: creating, updating, and deleting data
---

Within a Hydrogen App, [Server components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc#fetching-data-on-the-server) are used to fetch data and [API Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#api-routes) to mutate data. The `<Form>` component provides a declarative way to send data to API Routes, and re-render server components.

In order to understand how the `<Form>` component works, let's review how basic HTML forms work:

```html
<form action="/login" method="post">
  <label> Username <input type="text" name="username" /> </label>
  <label> Password <input type="password" name="password" /> </label>
  <button type="submit">Submit</button>
</form>
```

The above example has no JavaScript running. When the submit button is pressed, the browser sends a `POST` request to `/login` with each form field encoded. The browser also does a full page refresh displaying the response from the server. Again, this all happens without JavaScript. JavaScript becomes useful for a few reasons:

1. Improve performance by preventing the whole page from reloading
2. Improve the user experience with client-side validation and feedback

Hydrogen provides the `<Form>` component that mimicks the functionality of a native `<form>` element, while providing an enhanced user experience with client-side JavaScript.

## Example code

We can rewrite the above code by simply swapping out the native `<form>` element with a `<Form>` component imported from Hydrogen:

```tsx
import {Form} from '@shopify/hydrogen';

export default function Login() {
  return (
    <Form action="/login" method="post">
      <label>
        Username <input type="text" name="username" />
      </label>
      <label>
        Password <input type="password" name="password" />
      </label>
      <button type="submit">Submit</button>
    </Form>
  );
}

export async function api(request, {session}) {
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');

  const userId = await getUser(username, password);

  if (!userId) {
    return new Request('/login?error');
  }

  await session.set('userId', userId);

  return new Request('/account');
}
```

Simple login form

An action with hidden fields

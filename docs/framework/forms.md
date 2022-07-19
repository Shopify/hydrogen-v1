---
gid: 9120943b-01c9-4da3-a201-5a54cab6ca2a
title: Forms
description: Declarative mutations with `<Form>` and API Routes
---

Within a Hydrogen App, [Server components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc#fetching-data-on-the-server) are used to fetch data and [API Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#api-routes) to mutate data. The `Form` component provides a declarative way to send data to API Routes, and re-render server components.

## HTML `<form>`

In order to understand how the `<Form>` component works, let's review how basic HTML forms work:

{% codeblock file, filename: 'index.html' %}

```html
<form action="/login" method="post">
  <label> Username <input type="text" name="username" /> </label>
  <label> Password <input type="password" name="password" /> </label>
  <button type="submit">Submit</button>
</form>
```

{% endcodeblock %}

This example HTML doesn't run any JavaScript. When **Submit** is clicked,  the browser sends a `POST` request to `/login` with each form field encoded. The browser also reloads the entire page to display the server's response. Read more about [native HTML forms](https://developer.mozilla.org/en-US/docs/Learn/Forms).

## Hydrogen `<Form>`

Native HTML forms work without JavaScript. However, Javascript can provide the following improvements:

- **Performance**: JavaScript prevents the entire page from reloading to display responses from the server.
2. UX: JavaScript provides client-side validation and feedback {indicate benefit here?}

Hydrogen's `<Form>` component mimics the functionality of a native `<form>` element, while providing an enhanced user experience with client-side JavaScript. 

The following example rewrites the [example form element](#html-form) by substituting the native HTML with a `<Form>` component that's imported from Hydrogen:

{% codeblock file, filename: 'login.server.jsx' %}

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
```

{% endcodeblock %}

## `<Form>` requires an API route

The `action` attribute must point to an API route. The following is an example implementation:

{% codeblock file, filename: 'login.server.jsx' %}

```tsx
export async function api(request, {session}) {
  // Access the form data
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');

  // Find the user
  const userId = await getUser(username, password);

  if (!userId) {
    // We couldn't find the user.
    // Re-render the login page with a login error displayed
    return new Request('/login?error');
  }

  // Save the user to the session
  await session.set('userId', userId);

  // Forward the user to the account page
  return new Request('/account');
}
```

{% endcodeblock %}

Read data in the API route from the `<Form>` by using the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) API. The API Route must respond with a `new Request()`. This renders the server components for the given page. You can re-render the current page, or render an entirely different page in the app.

In the previous example, when the user is not found, the current page is re-rendered with a search parameter. The following code updates the server component to render the login error:

{% codeblock file, filename: 'login.server.jsx' %}

```tsx
import {Form} from '@shopify/hydrogen';

export default function Login() {
  const url = useUrl();
  return (
    <Form action="/login" method="post">
      <label>
        Username <input type="text" name="username" />
      </label>
      <label>
        Password <input type="password" name="password" />
      </label>
      {url.searchParams.get('error') ? (
        <h2 className="text-red-700">Invalid username or password</h2>
      ) : null}
      <button type="submit">Submit</button>
    </Form>
  );
}
```

{% endcodeblock %}

When the page initially loads, there is no search parameter. If the login mutation fails, the server components re-render with the `error` serach parameter, and this shows a message to the user. The downside to this approach is the error state is within the URL, which means the error message will stay if the page is refreshed. This will no longer be a problem with flashed session data.

## Client validation and feedback

So far, all of the examples have been completely in server components. While this is awesome, the best user experience has client-side validation and feedback to the user while the form is submitting. This requires a client component. Let's move the `<Form>` into a client component:

{% codeblock file, filename: 'login.server.jsx' %}

```tsx
import LoginForm from '../components/LoginForm.client.jsx';

export default function Login() {
  return <LoginForm />;
}
```

{% endcodeblock %}

{% codeblock file, filename: 'LoginForm.client.jsx' %}

```tsx
import {Form} from '@shopify/hydrogen';

export default function LoginForm() {
  const url = useUrl();
  return (
    <Form action="/login" method="post">
      <label>
        Username <input type="text" name="username" />
      </label>
      <label>
        Password <input type="password" name="password" />
      </label>
      {url.searchParams.get('error') ? (
        <h2 className="text-red-700">Invalid username or password</h2>
      ) : null}
      <button type="submit">Submit</button>
    </Form>
  );
}
```

{% endcodeblock %}

Because the `Form` is now within a client component, `children` can be a render prop. This enables you to give users feedback while the form is submitting.

{% codeblock file, filename: 'LoginForm.client.jsx' %}

```tsx
import {Form} from '@shopify/hydrogen';

export default function Login() {
  const url = useUrl();
  return (
    <Form action="/login" method="post">
      {({loading}) => (
        <>
          <label>
            Username <input type="text" name="username" />
          </label>
          <label>
            Password <input type="password" name="password" />
          </label>
          {url.searchParams.get('error') ? (
            <h2 className="text-red-700">Invalid username or password</h2>
          ) : null}
          <button type="submit" disabled={loading}>
            Submit
          </button>
        </>
      )}
    </Form>
  );
}
```

{% endcodeblock %}

## Hidden fields

You can use the `Form` component for any mutation that doesn't include a text field. 

For example, the following uses a `Form` component for adding items an item to a cart:

{% codeblock file, filename: 'Product.server.jsx' %}

```tsx
import {Form} from '@shopify/hydrogen';

export default function Product({product}) {
  return (
    <ProductDetails>
      <Form action="/addToCart" method="post">
        <input type="hidden" name="productId" value={product.id} />
        <button type="submit">Add to cart</button>
      </Form>
    </ProductDetails>
  );
}
```

{% endcodeblock %}

The hidden input field for the `productId` is sent to the server when the **Add to cart** button is clicked. The API route at `/addToCart` can contain all the logic to add the product to the cart and re-render the page. The button is actionable before the page fully loads and the JavaScript is hydrated.

## Next steps

Read the full API reference for the [`<Form>` component](https://shopify.dev/api/hydrogen/components/framework/form).

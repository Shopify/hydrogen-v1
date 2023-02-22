# Form


<aside class="note beta">
<h4>Experimental feature</h4>

<p>Hydrogen Form is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

Within a Hydrogen app, [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components/work-with-rsc#fetching-data-on-the-server) are used to fetch data and [API routes](https://shopify.dev/custom-storefronts/hydrogen/routing#api-routes) are used to mutate data. The `Form` component provides a declarative way to send data to API routes and re-render server components. The component mimics the functionality of a native `<form>` element, but it provides an enhanced user experience with client-side JavaScript.

## HTML `form` element

The `Form` component builds on the native HTML `<form>` element. The following is an example:

```html title="index.html"
<form action="/login" method="post">
  <label> Username <input type="text" name="username" /> </label>
  <label> Password <input type="password" name="password" /> </label>
  <button type="submit">Submit</button>
</form>
```



This example HTML doesn't run any JavaScript. When **Submit** is clicked, the browser sends a `POST` request to `/login` with each form field encoded. The browser also reloads the entire page to display the server's response. Learn more about [native HTML forms](https://developer.mozilla.org/en-US/docs/Learn/Forms).

## Hydrogen `Form` component

Hydrogen's `Form` component mimics the functionality of a native `<form>` element, while providing an enhanced experience with client-side JavaScript.

Native HTML forms work without JavaScript. However, JavaScript can provide the following improvements:

- **Performance**: JavaScript prevents the entire page from reloading to display responses from the server.
- **UX**: JavaScript provides client-side validation and feedback. Client-side validation is quicker than making a round trip to the server, and feedback helps the user know when the form is in the process of submitting.

## Client validation and feedback

The best user experience has client-side validation and gives user feedback while the form is submitting. This requires a client component.

## Example code

The following example rewrites the [example form element](#html-form-element) by substituting the native HTML with a `Form` component that's imported from Hydrogen.

Because the `Form` is within a client component, `children` can be a render prop. This enables you to give users feedback while the form is submitting.

```tsx title="LoginForm.client.jsx"
import {Form} from '@shopify/hydrogen/experimental';

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



## Hidden fields

You can use the `Form` component for any mutation that doesn't include a text field.

For example, the following uses a `Form` component for adding items an item to a cart:

```tsx title="Product.server.jsx"
import {Form} from '@shopify/hydrogen/experimental';

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



The hidden input field for the `productId` is sent to the server when the **Add to cart** button is clicked. The API route at `/addToCart` can contain all the logic to add the product to the cart and re-render the page. The button is actionable before the page fully loads and the JavaScript is hydrated.

## Form in server components

We recommend that you use `Form` in client components for the best user experience. However, you can use `Form` in server components if required. The following is an example:

```tsx title="login.server.jsx"
import {Form} from '@shopify/hydrogen/experimental';

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



### `Form` requires an API route

The `action` attribute must point to an API route. The following is an example implementation:

```tsx title="login.server.jsx"
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
    await session.set('loginError', true);
    return new Request('/login');
  }

  // Save the user to the session
  await session.set('userId', userId);

  // Forward the user to the account page
  return new Request('/account');
}
```



Read data in the API route from the `Form` by using the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) API. The API route must respond with a `new Request()`. This renders the server components for the given page. You can re-render the current page, or render an entirely different page in the app.

In the previous example, when the user is not found, the current page is re-rendered with an error set on the session. The following code updates the server component to render the login error:

```tsx title="login.server.jsx"
import {Form, useFlashSession} from '@shopify/hydrogen/experimental';

export default function Login() {
  // `useFlashSession` also clears the value after reading it. This way,
  // if the user refreshes the page, the validation error goes away.
  const loginError = useFlashSession('loginError');

  return (
    <Form action="/login" method="post">
      <label>
        Username <input type="text" name="username" />
      </label>
      <label>
        Password <input type="password" name="password" />
      </label>
      {loginError ? (
        <h2 className="text-red-700">Invalid username or password</h2>
      ) : null}
      <button type="submit">Submit</button>
    </Form>
  );
}
```



The page initially loads without a session `loginError` value. If the login mutation fails, then the server components re-render with the `loginError` session value and display a message to the user. Because the component uses `useFlashSession` instead of `useSession`, the value is subsequently cleared. If the user refreshes the page, then the validation error goes away.

## Props

The `Form` component shares the same props that are available to the [native `<form>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) with the following additions:

| Name      | Type                                                                   | Description                                                                                                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action    | `string`                                                    | The path to the API route that the form submits to. The API route must respond with a `new Request()`.                                                                                                                                                      |
| encType?  | `string`                                                    | The MIME type of the form submission. `multipart/form-data` is not yet supported.                                                                                                                                                                                    |
| onSubmit? | `Function`                                                  | A callback to intercept a submission event. The form doesn't submit if `event.preventDefault()` is called.                                                                                                                                                   |
| children? | `ReactNode` or `({loading, error}) => ReactNode` | Either pass any ReactNode, or a function that returns a ReactNode. That function will receive `loading` and `error` parameters. `loading` is `true` while forms are being submitted. `error` is populated when there's an error communicating with the server. |

## Component type

The `Form` component is a client component, so it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related framework topics

- [Forms and API routes](https://shopify.dev/custom-storefronts/hydrogen/routing/manage-routes#concatenate-requests)

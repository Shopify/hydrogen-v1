---
gid: 9120943b-00c9-4da3-a201-5a54cab6ca2a
title: Form
description: The Form provides a declarative way to perform mutations for creating, updating, and deleting data.
---

<aside class="note beta">
<h4>Experimental feature</h4>

<p>Hydrogen Form is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

Within a Hydrogen app, [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc#fetching-data-on-the-server) are used to fetch data and [API routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#api-routes) are used to mutate data. The `Form` component provides a declarative way to send data to API routes and re-render server components. The `Form` component mimics the functionality of a native `<form>` element, but it provides an enhanced user experience with client-side JavaScript.

## Example code

{% codeblock file, filename: 'LoginForm.client.jsx' %}

```tsx
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

{% endcodeblock %}

## Props

The `Form` component shares the same props that are available to the [native `<form>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) with the following additions:

| Name      | Type                                                                   | Description                                                                                                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action    | <code>string</code>                                                    | The path to the API route that the form submits to. The API route must respond with a `new Request()`.                                                                                                                                                      |
| encType?  | <code>string</code>                                                    | The MIME type of the form submission. `multipart/form-data` is not yet supported.                                                                                                                                                                                    |
| onSubmit? | <code>Function</code>                                                  | A callback to intercept a submission event. The form doesn't submit if `event.preventDefault()` is called.                                                                                                                                                   |
| children? | <code>ReactNode</code> or <code>({loading, error}) => ReactNode</code> | Either pass any ReactNode, or a function that returns a ReactNode. That function will receive `loading` and `error` parameters. `loading` is `true` while forms are being submitted. `error` is populated when there's an error communicating with the server. |

## Component type

The `Form` component is a client component, so it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related framework topics

- [Forms and API routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#concatenating-requests)

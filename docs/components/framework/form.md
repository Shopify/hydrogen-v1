---
gid: 9120943b-00c9-4da3-a201-5a54cab6ca2a
title: Form
description: The Form provides a declarative way to perform mutations: creating, updating, and deleting data
---

Within a Hydrogen App, [Server components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc#fetching-data-on-the-server) are used to fetch data and [API Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#api-routes) to mutate data. The `<Form>` component provides a declarative way to send data to API Routes, and re-render server components. The `<Form>` component that mimicks the functionality of a native `<form>` element, while providing an enhanced user experience with client-side JavaScript.

## Example code

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

## Props

The `<Form>` component shares the same props that are available to the [native `<form>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) with the following additions:

| Name      | Type                                                                   | Description                                                                                                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action    | <code>string</code>                                                    | The path to the API Route that the form will submit to. The API Route _must_ respond with a `new Request()`. .                                                                                                                                                         |
| encType?  | <code>string</code>                                                    | The MIME type of the form submission. `multipart/form-data` is _NOT_ yet supported.                                                                                                                                                                                    |
| onSubmit? | <code>Function</code>                                                  | Use this callback to intercept the submission event. The form will not submit if `event.preventDefault()` is called                                                                                                                                                    |
| children? | <code>ReactNode</code> or <code>({loading, error}) => ReactNode</code> | Either pass any ReactNode, or a function that returns a ReactNode. That function will receive a loading and error parameter. Loading will be `true` while the form is being submitted. The error will be populated if there is an error communicating with the server. |

## Component type

The `Form` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related framework topics

- [Forms and API Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)

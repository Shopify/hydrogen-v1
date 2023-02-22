# useFlashSession


<aside class="note beta">
<h4>Experimental feature</h4>

<p>`useFlashSession` is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

The `useFlashSession` hook reads session data and subsequently clears it in server components.

## Example code

```jsx title="src/component.server.jsx"
import {Form, useFlashSession} from '@shopify/hydrogen/experimental';

export default function Login() {
  const loginError = useFlashSession('loginError');

  return (
    <Form action="/login">
      {loginError ? <div>Invalid user!</div> : null}
      <input type="text" name="username" />
      <input type="password" name="password" />
      <button type="submit">Login</button>
    </Form>
  );
}

export async function api(request, {session}) {
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');

  const userId = await getUser(username, password);

  if (!userId) {
    await session.set('loginError', 'INVALID_USER');
    return new Request('/login');
  } else {
    await session.set('userId', userId);
    return new Request('/account');
  }
}
```



## Return value

The `useFlashSession` hook returns data from the session. It also clears that data so that it will be gone the next time that it's read.

## Considerations

The `useFlashSession` hook is best used for form validation in the [`Form`](/components/framework/form/) component.

## Related components

- [`Form`](/components/framework/form/)

## Related framework topics

- [`Forms`](/components/framework/form/)
- [Session management](https://shopify.dev/custom-storefronts/hydrogen/sessions)

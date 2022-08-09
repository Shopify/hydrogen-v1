---
'@shopify/hydrogen': minor
---

Add the experimental `useFlashSession` hook. This hook reads and clears a session value. It is useful for request validation within the experimental `<Form>` component:

```ts
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

export async function api(request) {
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

Note, `useFlashSession` is experimental, and subject to change at any time.

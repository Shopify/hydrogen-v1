import {useSession} from '@shopify/hydrogen';
import {useFlashSession} from '@shopify/hydrogen/experimental';
import {Form} from '@shopify/hydrogen/experimental';
import {
  LoginForm,
  LOGIN_ERROR,
  INVALID_USER,
  INVALID_USERNAME,
  INVALID_PASSWORD,
} from '../components/LoginForm.client';

const users = [
  {
    name: 'Abraham Lincoln',
    username: 'alincoln@example.com',
    password: 'somepass',
  },
];

export default function Account() {
  const {user} = useSession();
  const loginError = useFlashSession(LOGIN_ERROR);

  if (user)
    return (
      <div className="flex justify-center mt-24">
        <div className="w-full max-w-xs">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
            <div className="font-bold text-green-800 ">Welcome {user}!</div>
            <div className="mt-4">
              <Form action="/account" method="POST">
                <input type="hidden" name="action" value="logout" />
                <button type="submit">Log out</button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );

  return <LoginForm error={loginError} />;
}

export async function api(request, {session}) {
  const data = await request.formData();
  const action = data.get('action');

  if (action === 'logout') {
    await session.destroy();
    return new Request('/');
  }

  const username = data.get('username');
  const password = data.get('password');

  if (!username) {
    await session.set(LOGIN_ERROR, INVALID_USERNAME);
    return new Request(`/account`);
  }
  if (!password) {
    await session.set(LOGIN_ERROR, INVALID_PASSWORD);
    return new Request(`/account`);
  }

  const user = users.find(
    (user) => username === user.username && user.password === password
  );

  if (!user) {
    await session.set(LOGIN_ERROR, INVALID_USER);
    return new Request(`/account`);
  }

  await session.set('user', user.username);

  return new Request('/account');
}

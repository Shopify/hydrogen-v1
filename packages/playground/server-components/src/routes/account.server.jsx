import {Form, renderRsc, useSession} from '@shopify/hydrogen';
import {
  LoginForm,
  INVALID_USER,
  INVALID_USERNAME,
  INVALID_PASSWORD,
} from '../components/LoginForm.client';

const users = [
  {
    name: 'Abraham Lincoln',
    username: 'alincoln@shopify.com',
    password: 'somepass',
  },
];

export default function FormServer({error}) {
  const {user} = useSession();

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

  return <LoginForm error={error} />;
}

export async function api(request, {session}) {
  const data = await request.formData();
  const action = data.get('action');

  if (action === 'logout') {
    await session.destroy();
    return renderRsc({url: '/'});
  }

  const username = data.get('username');
  const password = data.get('password');

  // Note, you can throw or return a vanilla `Request` or `Response` object.
  // RequestServerComponents is just syntactic sugar, the user could manually create a
  // Response object instead.
  if (!username) return renderRsc({props: {error: INVALID_USERNAME}});
  if (!password) return renderRsc({props: {error: INVALID_PASSWORD}});

  const user = users.find(
    (user) => username === user.username && user.password === password
  );

  if (!user) {
    return renderRsc({props: {error: INVALID_USER}});
  }

  await session.set('user', user.username);

  return renderRsc();
}
